import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Order from '../models/Order';
import axios from 'axios';
import { createOrderSchema } from '../schemas/orderSchemas';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = createOrderSchema.safeParse(req.body);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      res.status(400).json({ errors });
      return;
    }

    const userId = req.user!.userId;
    const { shippingAddress } = validation.data;

    // Get cart from cart service
    let cart;
    try {
      const cartResponse = await axios.get(
        `${process.env.CART_SERVICE_URL || 'http://cart-service:3003'}/cart`,
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      cart = cartResponse.data;
    } catch (error) {
      res.status(404).json({ error: 'Cart not found or empty' });
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      res.status(400).json({ error: 'Cart is empty' });
      return;
    }

    // Create order
    const orderItems = cart.items.map((item: any) => ({
      productId: item.productId || item.product?._id || item.product?.id,
      name: item.product?.name || 'Product',
      price: item.product?.price || item.price,
      quantity: item.quantity,
      image: item.product?.image || '',
    }));

    const order = new Order({
      userId,
      items: orderItems,
      total: cart.total || orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      shippingAddress,
      status: 'Pending',
      paymentStatus: 'Pending',
    });

    await order.save();

    // Clear cart
    try {
      await axios.delete(
        `${process.env.CART_SERVICE_URL || 'http://cart-service:3003'}/cart`,
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const isAdmin = req.user!.role === 'admin';

    const query = isAdmin ? {} : { userId };
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const isAdmin = req.user!.role === 'admin';
    const orderId = req.params.id;

    const query: any = { _id: orderId };
    if (!isAdmin) {
      query.userId = userId;
    }

    const order = await Order.findOne(query).lean();

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, paymentStatus } = req.body;
    const orderId = req.params.id;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true }).lean();

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
