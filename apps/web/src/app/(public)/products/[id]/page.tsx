import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { serverFetch } from '@/lib/server-fetch';
import type { Product } from '@/hooks/use-products';
import { ProductCard } from '@/components/products/product-card';
import ReviewList from '@/components/product/ReviewList';
import { ProductInteractive } from './product-interactive';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  let product: Product | null = null;
  let recommendedProducts: Product[] = [];

  try {
    const [productRes, recommendationsRes] = await Promise.all([
      serverFetch<{ product: Product }>(`/products/${id}`),
      serverFetch<{ products: Product[] }>(`/products/${id}/recommendations?limit=4`),
    ]);
    
    product = productRes.product;
    recommendedProducts = recommendationsRes.products;
  } catch (error) {
    console.error('Failed to fetch product details:', error);
  }

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="bg-primary text-white hover:bg-primary/80 px-6 py-2 rounded-md font-medium">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-12">
      <Link href="/products" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to shop
      </Link>

      <ProductInteractive product={product} />

      <div className="mt-12 max-w-4xl mx-auto">
        {/* Note: ReviewList needs to be checked if it's a client component, but usually it fetches its own data or takes productId */}
        <ReviewList productId={id} />
      </div>

      {/* Similar Products Grid */}
      {recommendedProducts && recommendedProducts.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8">Similar Products You Might Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
