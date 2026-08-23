"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { api } from "@/lib/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  
  useEffect(() => {
    // Check session on initial load
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, [setUser]);

  return <>{children}</>;
}
