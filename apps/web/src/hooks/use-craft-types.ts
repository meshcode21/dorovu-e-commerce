import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/utils/queryKeys';
import { useUser } from './use-auth';
import { toast } from 'sonner';

export interface CraftType {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export const useCraftTypes = () => {
  return useQuery({
    queryKey: queryKeys.craftTypes.all(),
    queryFn: async () => {
      const { data } = await api.get('/craft-types');
      return data.craftTypes as CraftType[];
    },
  });
};

export const useCreateCraftType = () => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await api.post('/craft-types', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Craft Type created successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.craftTypes.all() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create craft type');
    },
  });
};

export const useDeleteCraftType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/craft-types/${id}`);
    },
    onSuccess: () => {
      toast.success('Craft Type deleted successfully');
      queryClient.invalidateQueries({ queryKey: queryKeys.craftTypes.all() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete craft type');
    },
  });
};
