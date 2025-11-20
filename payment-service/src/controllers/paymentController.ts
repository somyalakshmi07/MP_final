import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import axios from 'axios';
import { processPaymentSchema } from '../schemas/paymentSchemas';

// Simulate payment processing - always succeeds for demo
const simulatePayment = (): { success: boolean; transactionId: string; message: string } => {
  return {
    success: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    message: 'Payment Successful',
  };
};

export const processPayment = async (req: AuthRequest, res: Response) => {
  try {
    const validation = processPaymentSchema.safeParse(req.body);
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

    const { orderId } = validation.data;

    // Get order details
    let order;
    try {
      const orderResponse = await axios.get(
        `${process.env.ORDER_SERVICE_URL || 'http://order-service:3004'}/orders/${orderId}`,
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
      order = orderResponse.data;
    } catch (error: any) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.paymentStatus === 'Paid') {
      res.status(400).json({ error: 'Order already paid' });
      return;
    }

    // Simulate payment processing
    const paymentResult = simulatePayment();

    // Update order payment status and status to Completed
    try {
      await axios.put(
        `${process.env.ORDER_SERVICE_URL || 'http://order-service:3004'}/orders/${orderId}`,
        {
          paymentStatus: 'Paid',
          paymentId: paymentResult.transactionId,
          status: 'Completed',
        },
        {
          headers: { Authorization: req.headers.authorization },
        }
      );
    } catch (error) {
      console.error('Failed to update order:', error);
    }

    res.json({
      success: paymentResult.success,
      transactionId: paymentResult.transactionId,
      message: paymentResult.message,
      orderId,
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
