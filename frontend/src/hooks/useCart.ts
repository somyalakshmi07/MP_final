import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await api.get('/cart');
      // Store guest ID if returned from server
      if (response.data.guestId && !localStorage.getItem('token')) {
        localStorage.setItem('guestId', response.data.guestId);
      }
      return response.data;
    },
    retry: false, // Don't retry on error
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { productId: string; quantity?: number }) => {
      const response = await api.post('/cart/add', {
        productId: data.productId,
        quantity: data.quantity || 1,
      });
      // Store guest ID if returned from server
      if (response.data.guestId && !localStorage.getItem('token')) {
        localStorage.setItem('guestId', response.data.guestId);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart!');
    },
    onError: (error: any) => {
      // If backend is unavailable, show success message anyway (demo mode)
      if (!error.response || error.response?.status === 503 || error.code === 'ERR_NETWORK') {
        toast.success('Added to cart! (Demo mode - backend unavailable)');
        return;
      }
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((msg: any) => {
          toast.error(msg);
        });
      } else {
        toast.error(error.response?.data?.error || 'Failed to add to cart');
      }
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await api.put(`/cart/${productId}`, { quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update cart');
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await api.delete(`/cart/${productId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Removed from cart');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to remove from cart');
    },
  });
};
