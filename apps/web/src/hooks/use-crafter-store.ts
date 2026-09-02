import { api } from "@/lib/api";
import { queryKeys } from "@/utils/queryKeys";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export interface CrafterStore {
  id: string;
  crafterId: string;
  storeName: string;
  description: string;
  craftType: string;
  portfolioImages: string[];
  isApproved: boolean;
  commissionRate: number;
  rating: number;
  totalSales: number;
  createdAt: string;
  updatedAt: string;
}

export const useCrafterStore = (crafterId?: string) => {
  return useQuery({
    queryKey: queryKeys.crafter.profile(crafterId),
    queryFn: async () => {
      const { data } = await api.get(`/crafters/${crafterId}/store`);
      return data.data;
    },
    enabled: !!crafterId,
  });
};

export const useUpdateCrafterStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: FormData | { storeName?: string; description?: string; craftType?: string }) => {
      const headers = payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined;
      const { data } = await api.put("/crafters/store", payload, { headers });
      return data;
    },
    onSuccess: (_, variables) => {
      // We don't have the explicit crafterId here easily without context,
      // but we can invalidate the general crafter profile queries or specific if we know it.
      queryClient.invalidateQueries({ queryKey: ["crafter"] });
      toast.success("Shop settings updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update shop settings.");
    },
  });
};