export const queryKeys = {
  auth: {
    user: () => ['auth-user'] as const,
    my_store: () => ['my-store'] as const,
  },
  products: {
    all: () => ['products'] as const,
    list: (crafterId?: string, category?: string, search?: string, limit?: number) => {
      const parts = ['products', 'list'];
      if (crafterId) parts.push(`crafter-${crafterId}`);
      if (category) parts.push(`cat-${category}`);
      if (search) parts.push(`search-${search}`);
      if (limit) parts.push(`limit-${limit}`);
      return parts as readonly string[];
    },
    detail: (id: string) => ['products', id] as const,
    crafter: (id?: string) => ['products', 'crafter', id] as const,
    trending: (limit?: number) => ['products', 'trending', limit] as const,
  },
  cart: {
    all: () => ['cart'] as const,
  },
  orders: {
    all: () => ['orders'] as const,
    buyer: () => ['orders', 'buyer'] as const,
    crafter: () => ['orders', 'crafter'] as const,
    pendingCount: () => ['orders', 'pending-count'] as const,
  },
  categories: {
    all: () => ['categories'] as const,
  },
  craftTypes: {
    all: () => ['craft-types'] as const,
  },
  admin: {
    applications: (status?: string) => status ? ['admin', 'applications', status] as const : ['admin', 'applications'] as const,
    logistics: () => ['admin', 'logistics'] as const,
  },
  crafter: {
    profile: (id?: string) => ['crafter', id] as const,
    top: () => ['crafter', 'top'] as const,
  },
  reviews: {
    product: (id: string) => ['reviews', 'product', id] as const,
  },
} as const;
