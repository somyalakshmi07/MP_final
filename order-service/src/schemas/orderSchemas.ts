import { z } from 'zod';

export const createOrderSchema = z.object({
  shippingAddress: z.object({
    name: z.string().min(1, 'Name is required'),
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zipCode: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

