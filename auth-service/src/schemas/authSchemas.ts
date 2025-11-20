import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'This field is required'),
  email: z.string().min(1, 'This field is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'This field is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'This field is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Username and Password are required'),
  password: z.string().min(1, 'Username and Password are required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

