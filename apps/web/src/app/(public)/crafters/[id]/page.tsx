'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useProducts } from '@/hooks/use-products';
import { useCrafter } from '@/hooks/use-crafter';
import { ProductCard } from '@/components/products/product-card';
import { MapPin, Star, Calendar, User } from 'lucide-react';

export default function CrafterShopPage() {
  const { id } = useParams() as { id: string };
  const { data: crafter, isLoading: crafterLoading } = useCrafter(id);
  const { data: products, isLoading: productsLoading } = useProducts(id);

  if (crafterLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-muted w-full"></div>
        <div className="max-w-[1280px] mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-xl border border-border aspect-[3/4]"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!crafter) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground mb-4">Crafter Not Found</h1>
        <p className="text-muted-foreground">This shop does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Shop Header Banner */}
      <div className="bg-primary text-white border-b-8 border-secondary">
        <div className="max-w-[1280px] mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-background border-4 border-white overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-lg">
            {crafter.portfolioImages?.[0] ? (
              <Image 
                src={crafter.portfolioImages[0]}
                alt={crafter.storeName}
                fill
                sizes="(max-width: 768px) 128px, 160px"
                className="object-cover"
              />
            ) : (
              <User className='size-full text-primary p-5'/>
            )}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase mb-4 shadow-sm">
              {crafter.craftType} Artisan
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 drop-shadow-sm">
              {crafter.storeName}
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mb-6 leading-relaxed">
              {crafter.description}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-secondary" fill="currentColor" />
                {crafter.rating} Rating ({crafter.totalSales} sales)
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Nepal
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {new Date(crafter.createdAt).getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Products */}
      <div className="max-w-[1280px] mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-foreground mb-2">Shop Collection</h2>
        <p className="text-muted-foreground mb-10">Handcrafted pieces by {crafter.crafter.firstName}</p>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-xl border border-border aspect-[3/4]"></div>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-border shadow-sm">
            <p className="text-muted-foreground text-lg">This crafter hasn't listed any products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
