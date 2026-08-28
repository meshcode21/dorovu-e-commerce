import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/utils/queryKeys';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { LoginDTO, RegisterDTO } from '@dorovu/shared';

export interface User {
  id: string;
  email: string;
  role: 'BUYER' | 'CRAFTER' | 'ADMIN';
  firstName: string;
  lastName: string;
  createdAt?: string;
  googleId?: string | null;
}

export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: async () => {
      try {
        const { data } = await api.get('/auth/me');
        return data.user as User;
      } catch (error) {
        return null;
      }
    },
    retry: false,
    staleTime: Infinity, // The user object shouldn't go stale quickly. 
  });
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginDTO) => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
};

export const useGoogleLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (idToken: string) => {
      const response = await api.post('/auth/google', { idToken });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
      if (data.user.role === 'ADMIN') {
        router.push('/admin/applications');
      } else {
        router.push('/');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Google login failed');
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterDTO) => {
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.user(), null);
      queryClient.clear();
      router.push('/login');
    },
  });
};
