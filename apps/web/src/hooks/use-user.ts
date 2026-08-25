import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { UpdateProfileDTO } from "@dorovu/shared";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (data: UpdateProfileDTO) => {
      const response = await api.put("/users/profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully");
      // Update the global auth store with the new user info
      setUser(data.user);
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });
}
