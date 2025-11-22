import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  product: z.object({
    _id: z.string().optional(),
    name: z.string().optional(),
    price: z.number().optional(),
    image: z.string().optional(),
    slug: z.string().optional(),
  }).optional(),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;

