import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { serverFetch } from '@/lib/server-fetch';
import type { Product } from '@/hooks/use-products';

export async function TrendingProducts() {
  let trending: Product[] = [];
  let fallback: Product[] = [];

  try {
    const resTrending = await serverFetch<{ products: Product[] }>('/products/trending?limit=4');
    trending = resTrending.products;

    if (!trending || trending.length === 0 || !trending.some(p => p.totalSales && p.totalSales > 0)) {
      const resFallback = await serverFetch<{ products: Product[] }>('/products?limit=4');
      fallback = resFallback.products;
    }
  } catch (error) {
    console.error('Failed to fetch trending products:', error);
  }

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
