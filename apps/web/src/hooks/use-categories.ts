import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/utils/queryKeys';
import { useUser } from './use-auth';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}


export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.categories as Category[];
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await api.post('/categories', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create category');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete category');
    },
  });
};
