"use client";

import { useAllProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/products/product-card";

export const RecentlyAddedProducts = () => {
  // Fetch up to 8 recent products
  const { data: products, isLoading } = useAllProducts(undefined, undefined, undefined, 8);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-card rounded-xl border border-border aspect-[3/4]"></div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No recent products available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
