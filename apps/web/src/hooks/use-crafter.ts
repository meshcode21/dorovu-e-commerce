import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApplyCrafterDTO } from '@dorovu/shared';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useApplyCrafter = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: ApplyCrafterDTO) => {
      const response = await api.post('/crafters/apply', data);
      return response.data.data;
    },
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      router.push('/profile');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to submit application';
      toast.error(message);
    },
  });
};
