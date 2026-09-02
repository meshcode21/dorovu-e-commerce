import { serverFetch } from '@/lib/server-fetch';
import { ProductCard } from '@/components/products/product-card';
import { ProductFilters } from './product-filters';
import type { Product } from '@/hooks/use-products';
import type { Category } from '@/hooks/use-categories';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductListingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoryParam = typeof params.category === 'string' ? params.category : undefined;
  const searchParam = typeof params.search === 'string' ? params.search : undefined;

  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    // We can fetch in parallel
    const queryParams = new URLSearchParams();
    if (categoryParam) queryParams.append('category', categoryParam);
    if (searchParam) queryParams.append('search', searchParam);

    const [productsRes, categoriesRes] = await Promise.all([
      serverFetch<{ products: Product[] }>(`/products?${queryParams.toString()}`),
      serverFetch<{ categories: Category[] }>('/categories')
    ]);

    products = productsRes.products;
    categories = categoriesRes.categories;
  } catch (error) {
    console.error('Failed to fetch data for product listing:', error);
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Shop All Products</h1>
          <p className="text-muted-foreground text-lg">Discover unique handmade crafts</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <ProductFilters categories={categories} />

        <main className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground text-lg mb-2">No products found.</p>
              <p className="text-muted-foreground/50">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
