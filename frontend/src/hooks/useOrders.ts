import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { Order } from '../types';
import toast from 'react-hot-toast';

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get('/orders');
      return response.data;
    },
    retry: false, // Don't retry on error
  });
};

export const useOrder = (id: string) => {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
    retry: false, // Don't retry on error
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (data: { shippingAddress: any }) => {
      const response = await api.post('/orders', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Order created successfully!');
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((msg: any) => {
          toast.error(msg);
        });
      } else {
        toast.error(error.response?.data?.error || 'Failed to create order');
      }
    },
  });
};

export const useProcessPayment = () => {
  return useMutation({
    mutationFn: async (data: {
      orderId: string;
      paymentMethod: string;
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cardholderName: string;
    }) => {
      const response = await api.post('/payments', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Payment processed successfully!');
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((msg: any) => {
          toast.error(msg);
        });
      } else {
        toast.error(error.response?.data?.error || 'Payment failed');
      }
    },
  });
};
