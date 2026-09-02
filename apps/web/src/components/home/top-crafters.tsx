import Link from "next/link";
import { Star, User } from "lucide-react";
import { serverFetch } from "@/lib/server-fetch";
import Image from "next/image";

export async function TopCrafters() {
  let crafters: any[] = [];
  try {
    const res = await serverFetch<{ data: any[] }>('/crafters/top?limit=4');
    crafters = res.data;
  } catch (error) {
    console.error('Failed to fetch top crafters:', error);
  }

  if (!crafters || crafters.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {crafters.map((store: any) => {
        // Fallback to a placeholder avatar if no portfolio images exist
        const avatarImage = store.portfolioImages && store.portfolioImages.length > 0
          ? store.portfolioImages[0]
          : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(store.storeName)}`;

        return (
          <Link href={`/crafters/${store.id}`} key={store.id} className="group block">
            <div className="bg-card rounded-xl border border-border p-6 flex flex-col items-center text-center transition-all hover:shadow-md hover:border-primary/20 h-full">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-background shadow-sm">
                <Image
                  src={avatarImage}
                  alt={store.storeName}
                  fill
                  sizes="96px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                {store.storeName}
              </h3>

              <p className="text-muted-foreground text-sm line-clamp-2 mb-3 h-10">
                {store.description}
              </p>

              <div className="flex items-center gap-1 mt-auto">
                <Star className="w-4 h-4 fill-primary text-primary" />
                <span className="font-medium text-sm">{store.rating > 0 ? store.rating.toFixed(1) : "New"}</span>
                {store.totalSales > 0 && (
                  <span className="text-muted-foreground text-xs ml-1">({store.totalSales} sales)</span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
