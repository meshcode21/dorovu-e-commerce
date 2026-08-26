import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const { data } = await api.post('/orders', orderData);
      return data;
    },
    onSuccess: () => {
      toast.success('Order placed successfully!');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to place order');
    },
  });
};

export const useBuyerOrders = () => {
  return useQuery({
    queryKey: ['orders', 'buyer'],
    queryFn: async () => {
      const { data } = await api.get('/orders?role=buyer');
      return data.orders;
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await api.post(`/orders/${orderId}/cancel`);
      return data;
    },
    onSuccess: () => {
      toast.success('Order cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['orders', 'buyer'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    },
  });
};

export const useCrafterOrders = () => {
  return useQuery({
    queryKey: ['orders', 'crafter'],
    queryFn: async () => {
      const { data } = await api.get('/orders?role=crafter');
      return data.orderItems; // Crafter endpoint returns { orderItems: [...] }
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, status, trackingNumber }: { itemId: string; status: string; trackingNumber?: string }) => {
      const { data } = await api.put(`/orders/items/${itemId}/status`, { status, trackingNumber });
      return data;
    },
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['orders', 'crafter'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};
