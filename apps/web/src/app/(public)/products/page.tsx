'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { ProductCard } from '@/components/products/product-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function ProductListingPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const { data: products, isLoading: productsLoading } = useProducts(undefined, selectedCategory || undefined, searchTerm || undefined);
  const { data: categories } = useCategories();

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Shop All Products</h1>
          <p className="text-muted-foreground text-lg">Discover unique handmade crafts</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-card p-6 rounded-xl border border-border sticky top-24">
            <h2 className="font-display font-semibold text-xl mb-4 text-foreground">Filters</h2>
            
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div>
              <h3 className="font-medium text-muted-foreground mb-3 text-sm uppercase tracking-wider">Categories</h3>
              <div className="space-y-2 flex flex-col">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`text-left text-sm py-1 px-2 rounded transition-colors ${
                    selectedCategory === '' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  All Categories
                </button>
                {categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`text-left text-sm py-1 px-2 rounded transition-colors ${
                      selectedCategory === cat.name ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse bg-card rounded-xl border border-border aspect-[3/4]"></div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground text-lg mb-2">No products found.</p>
              <p className="text-muted-foreground/50">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
