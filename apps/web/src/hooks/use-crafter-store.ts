import { api } from "@/lib/api";
import { queryKeys } from "@/utils/queryKeys";
import { useQuery } from "@tanstack/react-query";

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