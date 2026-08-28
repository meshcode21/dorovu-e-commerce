export const queryKeys = {
  auth: {
    user: () => ['auth-user'] as const,
  },
  products: {
    all: () => ['products'] as const,
    list: (crafterId?: string, category?: string, search?: string) => ['products', crafterId, category, search] as const,
    crafter: (crafterId?: string) => ['products', 'crafter', crafterId] as const,
    detail: (id: string) => ['product', id] as const,
  },
  cart: {
    all: () => ['cart'] as const,
  },
  orders: {
    all: () => ['orders'] as const,
    buyer: () => ['orders', 'buyer'] as const,
    crafter: () => ['orders', 'crafter'] as const,
  },
  categories: {
    all: () => ['categories'] as const,
  },
  craftTypes: {
    all: () => ['craft-types'] as const,
  },
  admin: {
    applications: (status?: string) => ['admin', 'applications', status] as const,
  },
  crafter: {
    profile: (id?: string) => ['crafter', id] as const,
  },
} as const;
