'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);

  // Sync state when URL changes externally
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSearchTerm(searchParam);
  }, [categoryParam, searchParam]);

  // Debounced search term updater
  useEffect(() => {
    // Skip if input matches the current URL parameter
    if (searchTerm === searchParam) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim());
      } else {
        params.delete('search');
      }
      router.push(`/products?${params.toString()}`);
    }, 350);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, searchParam, searchParams, router]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-card p-6 rounded-xl border border-border sticky top-24">
        <h2 className="font-display font-semibold text-xl mb-4 text-foreground">Filters</h2>
        
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div>
          <h3 className="font-medium text-muted-foreground mb-3 text-sm uppercase tracking-wider">Categories</h3>
          <div className="space-y-2 flex flex-col">
            <button
              onClick={() => handleCategorySelect('')}
              className={`text-left text-sm py-1 px-2 rounded transition-colors ${
                selectedCategory === '' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              All Categories
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
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
  );
}
