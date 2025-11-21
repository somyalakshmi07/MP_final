import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'This field is required')
    .regex(/^[A-Za-z\s]+$/, 'Name must contain only alphabets (letters)'),
  email: z
    .string()
    .min(1, 'This field is required')
    .email('Please enter a valid email address')
    .refine((email) => email.endsWith('@gmail.com'), {
      message: 'Email must be a Gmail address (@gmail.com)',
    }),
  password: z
    .string()
    .min(1, 'This field is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one capital letter')
    .regex(/[a-z]/, 'Password must contain at least one small letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special symbol'),
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

