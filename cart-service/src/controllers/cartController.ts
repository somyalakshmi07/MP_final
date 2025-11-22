import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { redis } from '../config/redis';
import axios from 'axios';
import { addToCartSchema } from '../schemas/cartSchemas';

const CART_TTL = 7 * 24 * 60 * 60; // 7 days

const getCartKey = (userId: string): string => `cart:${userId}`;
const getGuestCartKey = (guestId: string): string => `cart:guest:${guestId}`;

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.guestId;
    if (!userId) {
      res.json({ items: [], total: 0 });
      return;
    }
    const cartKey = req.user ? getCartKey(userId) : getGuestCartKey(userId);
    const cartData = await redis.get(cartKey);

    if (!cartData) {
      res.json({ items: [], total: 0 });
      return;
    }

    const cart = JSON.parse(cartData);
    
    // Fetch product details (only if not already stored)
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item: any) => {
        // If item already has complete product details, use them
        if (item.product && item.product.name && item.product.price) {
          return item;
        }
        
        // Otherwise try to fetch product details
        try {
          const catalogUrl = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002';
          const productResponse = await axios.get(
            `${catalogUrl}/products/${item.productId}`,
            {
              timeout: 5000,
              validateStatus: (status) => status < 500,
            }
          );
          
          if (productResponse.status === 200 && productResponse.data?._id) {
            // Update the cart item with product details for future use
            const updatedItem = {
              ...item,
              product: productResponse.data,
              price: productResponse.data.price || item.price || 0,
            };
            
            // Update cart in Redis with product details
            const itemIndex = cart.items.findIndex((i: any) => i.productId === item.productId);
            if (itemIndex >= 0) {
              cart.items[itemIndex] = updatedItem;
              await redis.setex(cartKey, CART_TTL, JSON.stringify(cart));
            }
            
            return updatedItem;
          }
          
          // If product not found, return item with existing details
          console.warn(`Product not found for cart item: ${item.productId}`);
          return item;
        } catch (error: any) {
          console.error(`Error fetching product ${item.productId}:`, error.message);
          // Return item with existing details on error
          return item;
        }
      })
    );

    const total = itemsWithDetails.reduce(
      (sum: number, item: any) => sum + item.quantity * (item.product?.price || item.price || 0),
      0
    );

    res.json({ items: itemsWithDetails, total, guestId: req.guestId });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = addToCartSchema.safeParse(req.body);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      res.status(400).json({ errors });
      return;
    }

    const userId = req.user?.userId || req.guestId;
    if (!userId) {
      res.status(400).json({ error: 'User or guest ID required' });
      return;
    }
    const { productId, quantity, product: providedProduct } = validation.data;

    // Use provided product details if available, otherwise fetch from catalog
    let product = providedProduct || null;
    let productPrice = providedProduct?.price || 0;
    
    // If product details not provided, try to fetch from catalog
    if (!product || !product.name) {
      try {
        const catalogUrl = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002';
        const productResponse = await axios.get(
          `${catalogUrl}/products/${productId}`,
          {
            timeout: 5000,
            validateStatus: (status) => status < 500, // Don't throw on 404
          }
        );
        
        if (productResponse.status === 200 && productResponse.data?._id) {
          const fetchedProduct = productResponse.data;
          product = fetchedProduct;
          productPrice = fetchedProduct.price || 0;
          console.log(`Successfully fetched product ${productId}:`, fetchedProduct.name);
        } else {
          console.warn(`Product ${productId} not found in catalog, using provided details or defaults`);
        }
      } catch (error: any) {
        // Log but don't fail - use provided product details or continue without
        console.warn(`Could not fetch product ${productId} from catalog service:`, error.message);
        // Use provided product details if available
        if (providedProduct) {
          product = providedProduct;
          productPrice = providedProduct.price || 0;
        }
      }
    } else if (providedProduct && providedProduct.name) {
      // Use provided product details
      product = providedProduct;
      productPrice = providedProduct.price || 0;
      console.log(`Using provided product details for ${productId}:`, providedProduct.name);
    }

    const cartKey = req.user ? getCartKey(userId) : getGuestCartKey(userId);
    const cartData = await redis.get(cartKey);

    let cart = cartData ? JSON.parse(cartData) : { items: [] };

    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
      // Update product details if provided and not already set
      if (product && !cart.items[existingItemIndex].product) {
        cart.items[existingItemIndex].product = product;
        cart.items[existingItemIndex].price = productPrice;
      }
    } else {
      cart.items.push({
        productId,
        quantity,
        price: productPrice,
        product: product || undefined,
        addedAt: new Date().toISOString(),
      });
    }

    await redis.setex(cartKey, CART_TTL, JSON.stringify(cart));

    // Return updated cart with product details
    const updatedCart = await redis.get(cartKey);
    const parsedCart = JSON.parse(updatedCart || '{"items":[]}');
    
    const itemsWithDetails = await Promise.all(
      parsedCart.items.map(async (item: any) => {
        // If item already has product details, use them
        if (item.product && item.product.name) {
          return item;
        }
        
        // If this is the item we just added and we have product details, use them
        if (item.productId === productId && product) {
          return {
            ...item,
            product: product,
          };
        }
        
        // Otherwise try to fetch product details
        try {
          const catalogUrl = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002';
          const productResponse = await axios.get(
            `${catalogUrl}/products/${item.productId}`,
            {
              timeout: 3000,
              validateStatus: (status) => status < 500,
            }
          );
          
          if (productResponse.status === 200 && productResponse.data?._id) {
            return {
              ...item,
              product: productResponse.data,
            };
          }
        } catch (error: any) {
          // Silently fail - return item with existing details
        }
        
        // Return item (may have product details from storage or may not)
        return item;
      })
    );

    const total = itemsWithDetails.reduce(
      (sum: number, item: any) => sum + item.quantity * (item.product?.price || item.price || 0),
      0
    );

    res.json({ items: itemsWithDetails, total, guestId: req.guestId });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.guestId;
    if (!userId) {
      res.status(400).json({ error: 'User or guest ID required' });
      return;
    }
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      res.status(400).json({ error: 'Quantity must be greater than 0' });
      return;
    }

    const cartKey = req.user ? getCartKey(userId) : getGuestCartKey(userId);
    const cartData = await redis.get(cartKey);

    if (!cartData) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const cart = JSON.parse(cartData);
    const itemIndex = cart.items.findIndex(
      (item: any) => item.productId === productId
    );

    if (itemIndex === -1) {
      res.status(404).json({ error: 'Item not found in cart' });
      return;
    }

    cart.items[itemIndex].quantity = quantity;
    await redis.setex(cartKey, CART_TTL, JSON.stringify(cart));

    // Return updated cart with product details
    const updatedCartData = await redis.get(cartKey);
    const parsedCart = JSON.parse(updatedCartData || '{"items":[]}');
    
    const itemsWithDetails = await Promise.all(
      parsedCart.items.map(async (item: any) => {
        // If item already has product details, use them
        if (item.product && item.product.name) {
          return item;
        }
        
        // Try to fetch product details
        try {
          const catalogUrl = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002';
          const productResponse = await axios.get(
            `${catalogUrl}/products/${item.productId}`,
            {
              timeout: 3000,
              validateStatus: (status) => status < 500,
            }
          );
          
          if (productResponse.status === 200 && productResponse.data?._id) {
            return {
              ...item,
              product: productResponse.data,
            };
          }
        } catch (error: any) {
          // Silently fail
        }
        
        return item;
      })
    );

    const total = itemsWithDetails.reduce(
      (sum: number, item: any) => sum + item.quantity * (item.product?.price || item.price || 0),
      0
    );

    res.json({ message: 'Cart updated', items: itemsWithDetails, total, guestId: req.guestId });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.guestId;
    if (!userId) {
      res.status(400).json({ error: 'User or guest ID required' });
      return;
    }
    const { productId } = req.params;
    const cartKey = req.user ? getCartKey(userId) : getGuestCartKey(userId);
    const cartData = await redis.get(cartKey);

    if (!cartData) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const cart = JSON.parse(cartData);
    cart.items = cart.items.filter((item: any) => item.productId !== productId);

    if (cart.items.length === 0) {
      await redis.del(cartKey);
      res.json({ message: 'Item removed from cart', items: [], total: 0, guestId: req.guestId });
      return;
    }
    
    await redis.setex(cartKey, CART_TTL, JSON.stringify(cart));

    // Return updated cart with product details
    const updatedCartData = await redis.get(cartKey);
    const parsedCart = JSON.parse(updatedCartData || '{"items":[]}');
    
    const itemsWithDetails = await Promise.all(
      parsedCart.items.map(async (item: any) => {
        // If item already has product details, use them
        if (item.product && item.product.name) {
          return item;
        }
        
        // Try to fetch product details
        try {
          const catalogUrl = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002';
          const productResponse = await axios.get(
            `${catalogUrl}/products/${item.productId}`,
            {
              timeout: 3000,
              validateStatus: (status) => status < 500,
            }
          );
          
          if (productResponse.status === 200 && productResponse.data?._id) {
            return {
              ...item,
              product: productResponse.data,
            };
          }
        } catch (error: any) {
          // Silently fail
        }
        
        return item;
      })
    );

    const total = itemsWithDetails.reduce(
      (sum: number, item: any) => sum + item.quantity * (item.product?.price || item.price || 0),
      0
    );

    res.json({ message: 'Item removed from cart', items: itemsWithDetails, total, guestId: req.guestId });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId || req.guestId;
    if (!userId) {
      res.status(400).json({ error: 'User or guest ID required' });
      return;
    }
    const cartKey = req.user ? getCartKey(userId) : getGuestCartKey(userId);
    await redis.del(cartKey);

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
