import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'BUYER' | 'CRAFTER' | 'ADMIN';
  firstName: string;
  lastName: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
