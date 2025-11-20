import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, 'This field is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
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
      setAuth(data.user, data.token);
      toast.success('Logged in successfully!');
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((msg: any) => {
          toast.error(msg);
        });
      } else {
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
