import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import type { LoginDTO, RegisterDTO } from '@dorovu/shared';

export interface User {
  id: string;
  email: string;
  role: 'BUYER' | 'CRAFTER' | 'ADMIN';
  firstName: string;
  lastName: string;
  createdAt?: string;
  googleId?: string | null;
  crafterProfile?: {
    id: string;
    storeName: string;
  };
}

export const useUser = () => {
  return useQuery({
    queryKey: ['auth-user'],
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
      queryClient.setQueryData(['auth-user'], data.user);
      if (data.user.role === 'ADMIN') {
        router.push('/admin/applications');
      } else {
        router.push('/');
      }
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
      queryClient.setQueryData(['auth-user'], data.user);
      if (data.user.role === 'ADMIN') {
        router.push('/admin/applications');
      } else {
        router.push('/');
      }
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
      queryClient.setQueryData(['auth-user'], data.user);
      router.push('/');
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
      queryClient.setQueryData(['auth-user'], null);
      queryClient.clear();
      router.push('/login');
    },
  });
};
