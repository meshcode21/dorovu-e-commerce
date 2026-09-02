'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAddToCart } from '@/hooks/use-cart';
import { useUser } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Store, Package, Clock, ShieldCheck } from 'lucide-react';
import type { Product } from '@/hooks/use-products';

interface ProductInteractiveProps {
  product: Product;
}

export function ProductInteractive({ product }: ProductInteractiveProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const router = useRouter();
  const { data: user } = useUser();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();

  // Pre-select first variant if not selected
  const activeVariantId = selectedVariantId || (product.variants?.[0]?.id ?? null);
  const activeVariant = product.variants?.find(v => v.id === activeVariantId);
  const finalPrice = product.price + (activeVariant?.priceAdjustment || 0);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop'];
  
  const activeImage = images[activeImageIndex] || images[0];

  return (
    <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image Gallery */}
        <div className="flex flex-col md:border-r border-border">
          <div className="bg-background relative aspect-square">
            <Image
              src={activeImage}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto border-t border-border">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    activeImageIndex === index ? 'border-primary' : 'border-transparent hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-8 md:p-12 flex flex-col">
          <div className="flex gap-2 mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase">
              {product.category}
            </span>
            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase">
              {product.craftType}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {product.title}
          </h1>

          <Link href={`/crafters/${product.crafterId}`} className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
            <Store className="w-4 h-4 mr-2" />
            {product.crafter?.storeName || 'Artisan Shop'}
          </Link>

          <div className="text-3xl font-semibold text-primary mb-8">
            Rs. {finalPrice.toLocaleString()}
          </div>

          <div className="prose prose-sm text-muted-foreground mb-8 max-w-none">
            <p>{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wider">Select Option</h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${activeVariantId === variant.id
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border text-foreground hover:border-primary/50'
                      }`}
                  >
                    {variant.name}
                    {variant.priceAdjustment > 0 && ` (+Rs. ${variant.priceAdjustment})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center text-sm text-muted-foreground bg-background p-3 rounded-lg border border-border">
              <Package className="w-5 h-5 text-secondary mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">Stock</div>
                <div>{activeVariant?.stock || 0} available</div>
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground bg-background p-3 rounded-lg border border-border">
              <Clock className="w-5 h-5 text-secondary mr-3 flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">Lead Time</div>
                <div>{product.leadTime} days</div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 h-14 text-lg border-primary text-primary hover:bg-primary/5 rounded-xl font-medium"
                disabled={!activeVariant || activeVariant.stock === 0 || isAdding}
                onClick={() => {
                  if (!user) {
                    router.push('/login');
                    return;
                  }
                  if (activeVariant) {
                    addToCart({ variantId: activeVariant.id, quantity: 1 });
                  }
                }}
              >
                {!activeVariant || activeVariant.stock === 0 ? 'Out of Stock' : isAdding ? 'Adding...' : 'Add to Cart'}
              </Button>
              <Button
                className="flex-1 h-14 text-lg bg-primary hover:bg-primary/90 text-white rounded-xl font-medium shadow-md"
                disabled={!activeVariant || activeVariant.stock === 0}
                onClick={() => {
                  if (!user) {
                    router.push(`/login?redirect=/products/${product.id}`);
                    return;
                  }
                  if (activeVariant) {
                    router.push(`/checkout?buyNowVariant=${activeVariant.id}&productId=${product.id}&qty=1`);
                  }
                }}
              >
                Buy Now
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground gap-2">
              <ShieldCheck className="w-4 h-4" />
              Secure checkout and buyer protection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
