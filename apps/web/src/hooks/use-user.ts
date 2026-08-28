import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { queryKeys } from "@/utils/queryKeys";
import { UpdateProfileDTO } from "@dorovu/shared";
import { toast } from "sonner";
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileDTO) => {
      const response = await api.put("/users/profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully");
      // Update the global auth store with the new user info
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
}
