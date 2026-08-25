'use client';

import { useProducts } from '@/hooks/use-products';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function TrendingProducts() {
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-card rounded-xl border border-border aspect-[3/4]"></div>
        ))}
      </div>
    );
  }

  // Get up to 4 latest products
  const trending = products?.slice(0, 4) || [];

  if (trending.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="mb-4">No products available yet.</p>
        <Link href="/apply">
          <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
            Be the first to sell!
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {trending.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
