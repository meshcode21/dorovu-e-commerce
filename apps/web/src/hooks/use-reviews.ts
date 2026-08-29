import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { queryKeys } from '@/utils/queryKeys';
import { CreateReviewDTO, UpdateReviewDTO, ReplyReviewDTO } from '@dorovu/shared';

export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: queryKeys.reviews.product(productId),
    queryFn: async () => {
      const res = await api.get(`/products/${productId}/reviews`);
      return res.data.reviews;
    },
    enabled: !!productId,
  });
};

export const useCreateReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderItemId, data }: { orderItemId: string; data: CreateReviewDTO }) => {
      const res = await api.post(`/reviews/${orderItemId}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.buyer() });
    },
  });
};

export const useUpdateReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, data }: { reviewId: string; data: UpdateReviewDTO }) => {
      const res = await api.put(`/reviews/${reviewId}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.buyer() });
    },
  });
};

export const useDeleteReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await api.delete(`/reviews/${reviewId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.buyer() });
    },
  });
};

export const useReplyReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, data }: { reviewId: string; data: ReplyReviewDTO }) => {
      const res = await api.put(`/reviews/${reviewId}/reply`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.product(productId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.crafter() });
    },
  });
};
