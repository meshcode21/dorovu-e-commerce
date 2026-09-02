import Link from "next/link";
import Image from "next/image";
import { serverFetch } from "@/lib/server-fetch";
import type { Category } from "@/hooks/use-categories";
import { Image as ImageIcon } from "lucide-react";

export async function DynamicCategories() {
  let categories: Category[] = [];
  try {
    const res = await serverFetch<{ categories: Category[] }>('/categories');
    categories = res.categories;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
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
        return (
          <Link href={`/products?category=${encodeURIComponent(category.name)}`} key={category.id} className="group block">
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-muted border border-sand flex items-center justify-center">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <ImageIcon className="w-12 h-12 text-muted-foreground/30 group-hover:scale-105 transition-transform duration-500" />
              )}
            </div>
            <h3 className="font-display font-semibold text-lg text-center text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
          </Link>
        );
      })}
    </div>
  );
}
