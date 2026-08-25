import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export interface ProductVariant {
  id: string;
  name: string;
  stock: number;
  priceAdjustment: number;
}

export interface Product {
  id: string;
  crafterId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  tags: string[];
  craftType: string;
  category: string;
  isCustomOrder: boolean;
  leadTime: number;
  avgRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
  crafter?: {
    storeName: string;
    description?: string;
  };
}

export const useProducts = (crafterId?: string, category?: string, search?: string) => {
  return useQuery({
    queryKey: ['products', crafterId, category, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (crafterId) params.append('crafterId', crafterId);
      if (category) params.append('category', category);
      if (search) params.append('search', search);

      const { data } = await api.get(`/products?${params.toString()}`);
      return data.products as Product[];
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${id}`);
      return data.product as Product;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Product created successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/crafter/products');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      router.push('/crafter/products');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/products/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};
