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
    
    // Fetch product details
    const itemsWithDetails = await Promise.all(
      cart.items.map(async (item: any) => {
        try {
          const catalogUrl = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002';
          const productResponse = await axios.get(
            `${catalogUrl}/products/${item.productId}`,
            {
              timeout: 5000,
              validateStatus: (status) => status < 500,
            }
          );
          
          if (productResponse.status === 200) {
            return {
              ...item,
              product: productResponse.data,
            };
          }
          
          // If product not found, return item without product details
          console.warn(`Product not found for cart item: ${item.productId}`);
          return item;
        } catch (error: any) {
          console.error(`Error fetching product ${item.productId}:`, error.message);
          // Return item without product details on error
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
    const { productId, quantity } = validation.data;

    // Fetch product details
    let product;
    try {
      const catalogUrl = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002';
      const productResponse = await axios.get(
        `${catalogUrl}/products/${productId}`,
        {
          timeout: 5000,
          validateStatus: (status) => status < 500, // Don't throw on 404
        }
      );
      
      if (productResponse.status === 404) {
        console.error(`Product not found: ${productId} from ${catalogUrl}/products/${productId}`);
        res.status(404).json({ error: 'Product not found', productId });
        return;
      }
      
      if (productResponse.status !== 200) {
        console.error(`Catalog service error: ${productResponse.status}`, productResponse.data);
        res.status(productResponse.status).json({ 
          error: 'Failed to fetch product details',
          details: productResponse.data 
        });
        return;
      }
      
      if (!productResponse.data || !productResponse.data._id) {
        console.error(`Invalid product response for ${productId}:`, productResponse.data);
        res.status(404).json({ error: 'Product not found - invalid response', productId });
        return;
      }
      
      product = productResponse.data;
      console.log(`Successfully fetched product ${productId}:`, product.name);
    } catch (error: any) {
      console.error('Error fetching product from catalog service:', {
        productId,
        error: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        catalogUrl: process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002',
      });
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        res.status(503).json({ 
          error: 'Catalog service unavailable. Please ensure catalog-service is running.',
          productId 
        });
        return;
      }
      
      if (error.response?.status === 404) {
        res.status(404).json({ error: 'Product not found', productId });
        return;
      }
      
      res.status(500).json({ 
        error: 'Failed to fetch product details',
        productId,
        details: error.message 
      });
      return;
    }

    const cartKey = req.user ? getCartKey(userId) : getGuestCartKey(userId);
    const cartData = await redis.get(cartKey);

    let cart = cartData ? JSON.parse(cartData) : { items: [] };

    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.productId === productId
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
        addedAt: new Date().toISOString(),
      });
    }

    await redis.setex(cartKey, CART_TTL, JSON.stringify(cart));

    // Return updated cart
    const updatedCart = await redis.get(cartKey);
    const parsedCart = JSON.parse(updatedCart || '{"items":[]}');
    
    const itemsWithDetails = await Promise.all(
      parsedCart.items.map(async (item: any) => {
        try {
          const productResponse = await axios.get(
            `${process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002'}/products/${item.productId}`
          );
          return {
            ...item,
            product: productResponse.data,
          };
        } catch (error) {
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

    res.json({ message: 'Cart updated', cart });
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
    } else {
      await redis.setex(cartKey, CART_TTL, JSON.stringify(cart));
    }

    res.json({ message: 'Item removed from cart', cart });
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
