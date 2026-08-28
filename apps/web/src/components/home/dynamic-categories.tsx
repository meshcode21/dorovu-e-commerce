"use client";

import Link from "next/link";
import Image from "next/image";
import { useCategories } from "@/hooks/use-categories";

// A fallback map of images for common craft types.
const FALLBACK_IMAGES: Record<string, string> = {
  "Crochet": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=400&auto=format&fit=crop",
  "Pottery": "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop",
  "Jewelry": "https://images.unsplash.com/photo-1599643477873-ce830919fcd4?q=80&w=400&auto=format&fit=crop",
  "Woodwork": "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=400&auto=format&fit=crop",
  "Textiles": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=400&auto=format&fit=crop",
  "Other": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop",
  "Default": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=400&auto=format&fit=crop"
};

export const DynamicCategories = () => {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded-xl bg-muted mb-3"></div>
            <div className="h-6 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Use the first 6 categories, or fallback to default ones if API is empty
  const categoriesToDisplay = categories?.slice(0, 6) || [];

  if (categoriesToDisplay.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No categories available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {categoriesToDisplay.map((category) => {
        // Find matching image, case-insensitive, or use Default
        const matchedKey = Object.keys(FALLBACK_IMAGES).find(
          (key) => key.toLowerCase() === category.name.toLowerCase()
        );
        const imageUrl = matchedKey ? FALLBACK_IMAGES[matchedKey] : FALLBACK_IMAGES.Default;

        return (
          <Link href={`/products?category=${encodeURIComponent(category.name)}`} key={category.id} className="group block">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-muted">
              <Image
                src={imageUrl}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="font-display font-semibold text-lg text-center text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </Link>
        );
      })}
    </div>
  );
};
