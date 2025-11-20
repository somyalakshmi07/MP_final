import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { redis } from '../config/redis';
import axios from 'axios';
import { addToCartSchema } from '../schemas/cartSchemas';

const CART_TTL = 7 * 24 * 60 * 60; // 7 days

const getCartKey = (userId: string): string => `cart:${userId}`;

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const cartKey = getCartKey(userId);
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
          const productResponse = await axios.get(
            `${process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002'}/products/${item.productId}`,
            {
              headers: { Authorization: req.headers.authorization },
            }
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

    res.json({ items: itemsWithDetails, total });
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

    const userId = req.user!.userId;
    const { productId, quantity } = validation.data;

    // Fetch product details
    let product;
    try {
      const productResponse = await axios.get(
        `${process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002'}/products/${productId}`,
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      product = productResponse.data;
    } catch (error) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const cartKey = getCartKey(userId);
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
            `${process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002'}/products/${item.productId}`,
            {
              headers: { Authorization: req.headers.authorization },
            }
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

    res.json({ items: itemsWithDetails, total });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      res.status(400).json({ error: 'Quantity must be greater than 0' });
      return;
    }

    const cartKey = getCartKey(userId);
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
    const userId = req.user!.userId;
    const { productId } = req.params;
    const cartKey = getCartKey(userId);
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
    const userId = req.user!.userId;
    const cartKey = getCartKey(userId);
    await redis.del(cartKey);

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
