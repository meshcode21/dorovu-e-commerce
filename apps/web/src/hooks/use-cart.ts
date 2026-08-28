import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/utils/queryKeys';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  variant: {
    id: string;
    name: string;
    priceAdjustment: number;
    stock: number;
    product: {
      id: string;
      title: string;
      images: string[];
      crafterId: string;
      price: number;
    }
  }
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export const useCart = (isAuthenticated: boolean) => {
  return useQuery({
    queryKey: queryKeys.cart.all(),
    queryFn: async () => {
      const { data } = await api.get('/cart');
      return data.cart as Cart;
    },
    // Only fetch cart if user is logged in
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ variantId, quantity = 1 }: { variantId: string; quantity?: number }) => {
      const { data } = await api.post('/cart/items', { variantId, quantity });
      return data;
    },
    onSuccess: () => {
      toast.success('Added to cart');
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const { data } = await api.put(`/cart/items/${itemId}`, { quantity });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update item');
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const { data } = await api.delete(`/cart/items/${itemId}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Removed from cart');
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete('/cart');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all() });
    },
  });
};
