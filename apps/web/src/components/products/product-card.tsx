import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/hooks/use-products';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=400&auto=format&fit=crop';
  const priceToDisplay = product.price;

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <div className="relative aspect-square bg-background">
          <Image 
            src={primaryImage} 
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="text-xs font-mono text-secondary uppercase tracking-wider mb-1 truncate">
            {product.category}
          </div>
          <h3 className="font-medium text-foreground truncate mb-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 truncate">
            By {product.crafter?.storeName || 'Artisan'}
          </p>
          <div className="mt-auto flex justify-between items-center pt-2">
            <span className="font-semibold text-primary">Rs. {priceToDisplay.toLocaleString()}</span>
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span>{product.avgRating?.toFixed(1) || '0.0'}</span>
              <span className="text-xs">({product.totalReviews || 0})</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
