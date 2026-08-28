'use client';

import { useTrendingProducts } from '@/hooks/use-products';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAllProducts } from '@/hooks/use-products';

export function TrendingProducts() {
  const { data: trending, isLoading } = useTrendingProducts(4);
  const { data: fallback, isLoading: fallbackLoading } = useAllProducts(undefined, undefined, undefined, 4);

  if (isLoading || fallbackLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-card rounded-xl border border-border aspect-[3/4]"></div>
        ))}
      </div>
    );
  }

  // Filter out products with 0 sales if we want to be strict, but for MVP let's just use trending
  // If all trending have 0 sales, fallback to recently added
  const hasSales = trending && trending.length > 0 && trending.some(p => p.totalSales && p.totalSales > 0);
  const displayProducts = hasSales ? trending : fallback?.slice(0, 4) || [];

  if (displayProducts.length === 0) {
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
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
