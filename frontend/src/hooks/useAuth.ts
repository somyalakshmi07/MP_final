import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { z } from 'zod';

const registerSchema = z.object({
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

const loginSchema = z.object({
  email: z.string().min(1, 'Username and Password are required'),
  password: z.string().min(1, 'Username and Password are required'),
});

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const validation = loginSchema.safeParse(data);
      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        throw { response: { data: { errors }, status: 400 } };
      }
      const response = await api.post('/auth/login', validation.data);
      return response.data;
    },
    onSuccess: (data) => {
      // Store JWT token and user data
      setAuth(data.user, data.token);
      toast.success('Logged in successfully!');
      // Note: Navigation is handled in the Login component
    },
    onError: (error: any) => {
      // Handle validation errors (empty fields)
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((msg: any) => {
          toast.error(msg);
        });
      } 
      // Handle invalid credentials (401)
      else if (error.response?.status === 401) {
        toast.error('Invalid credentials');
      }
      // Handle service unavailable
      else if (error.response?.status === 0 || error.code === 'ERR_NETWORK' || !error.response) {
        toast.error('Service unavailable. Please ensure all backend services are running.');
      }
      // Handle other errors
      else {
        toast.error(error.response?.data?.error || 'Login failed');
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string; name: string; confirmPassword: string }) => {
      const validation = registerSchema.safeParse(data);
      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        throw { response: { data: { errors }, status: 400 } };
      }
      const response = await api.post('/auth/register', {
        name: validation.data.name,
        email: validation.data.email,
        password: validation.data.password,
        confirmPassword: validation.data.confirmPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Account created successfully! Please login to continue.');
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((msg: any) => {
          toast.error(msg);
        });
      } else if (error.response?.status === 0 || error.code === 'ERR_NETWORK' || !error.response) {
        toast.error('Service unavailable. Please ensure all backend services are running.');
      } else {
        toast.error(error.response?.data?.error || 'Registration failed');
      }
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await api.get('/auth/profile');
      return response.data;
    },
    enabled: !!localStorage.getItem('token'),
  });
};
