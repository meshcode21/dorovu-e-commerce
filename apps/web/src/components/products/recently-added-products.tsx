import { ProductCard } from "@/components/products/product-card";
import { serverFetch } from "@/lib/server-fetch";
import type { Product } from "@/hooks/use-products";

export async function RecentlyAddedProducts() {
  let products: Product[] = [];
  try {
    const res = await serverFetch<{ products: Product[] }>('/products?limit=8');
    products = res.products;
  } catch (error) {
    console.error('Failed to fetch recent products:', error);
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
