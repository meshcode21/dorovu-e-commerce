import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/utils/queryKeys';
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
  totalSales: number;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
  crafter?: {
    storeName: string;
    description?: string;
  };
}



export const useProducts = (crafterId?: string) => {
  return useQuery({
    queryKey: queryKeys.products.crafter(crafterId),
    queryFn: async () => {
      if (!crafterId) return [];
      const { data } = await api.get(`/products?crafterId=${crafterId}`);
      return data.products as Product[];
    },
    enabled: !!crafterId,
  });
};



export const useProduct = (id: string) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
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
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    },
  });
};
