import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CrafterApplication {
  id: string;
  userId: string;
  storeName: string;
  description: string;
  craftType: string;
  status: ApplicationStatus;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const useApplications = (status?: ApplicationStatus) => {
  return useQuery({
    queryKey: ['admin', 'applications', status],
    queryFn: async () => {
      const { data } = await api.get('/admin/applications', {
        params: { status }
      });
      return data.data as CrafterApplication[];
    }
  });
};

export const useApproveApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put(`/admin/applications/${id}/approve`);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Application approved successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve application');
    }
  });
};

export const useRejectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put(`/admin/applications/${id}/reject`);
      return data.data;
    },
    onSuccess: () => {
      toast.success('Application rejected');
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject application');
    }
  });
};
