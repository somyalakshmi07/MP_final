import { z } from 'zod';

export const processPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  cardNumber: z.string().min(16, 'Card number is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  cvv: z.string().min(3, 'CVV is required'),
  cardholderName: z.string().min(1, 'Cardholder name is required'),
});

export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;

