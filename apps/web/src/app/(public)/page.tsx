import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, Package } from "lucide-react";
import { TrendingProducts } from "@/components/products/trending-products";
import { DynamicCategories } from "@/components/home/dynamic-categories";
import { DynamicHeroImage } from "@/components/home/dynamic-hero-image";
import { TopCrafters } from "@/components/home/top-crafters";
import { RecentlyAddedProducts } from "@/components/products/recently-added-products";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary text-white py-12 md:py-20 px-4 overflow-hidden">
        <div className="max-w-[1280px] mx-auto flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
              Threaded with love, <br /> made for you.
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-8 max-w-md">
              Discover unique, handcrafted treasures from Nepal's most talented artisans. Every piece tells a story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/products"
                className={buttonVariants({
                  size: "lg",
                  className: "bg-white !text-primary hover:!bg-background shadow-md font-semibold px-8 w-full sm:w-auto"
                })}
              >
                Shop Now
              </Link>
              <Link
                href="/apply"
                className={buttonVariants({
                  size: "lg",
                  className: "border-white text-white bg-transparent hover:bg-white/10 w-full sm:w-auto"
                })}
              >
                Start Selling
              </Link>
            </div>
          </div>
          <DynamicHeroImage />
        </div>
      </section>

      {/* Features/Values */}
      <section className="py-16 bg-background border-b border-border">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-border shadow-sm">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2 text-foreground">Handmade with Love</h3>
            <p className="text-muted-foreground text-sm">Every item on Dorovu is carefully crafted by independent artisans.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-border shadow-sm">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2 text-foreground">Unique & Authentic</h3>
            <p className="text-muted-foreground text-sm">Find one-of-a-kind pieces that you won't see anywhere else.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-card rounded-xl border border-border shadow-sm">
            <div className="w-12 h-12 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-4">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2 text-foreground">Secure Delivery</h3>
            <p className="text-muted-foreground text-sm">Safe and reliable shipping directly from the creator to your door.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 max-w-[1280px] mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Explore our wide range of handcrafted goods</p>
          </div>
          <Link href="/products" className="text-primary font-medium flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <DynamicCategories />
      </section>

      {/* Recently Added Products */}
      <section className="py-20 px-4 max-w-[1280px] mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Fresh Finds</h2>
            <p className="text-muted-foreground">The newest handcrafted arrivals</p>
          </div>
          <Link href="/products" className="text-primary font-medium flex items-center gap-1 hover:underline">
            Shop All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <RecentlyAddedProducts />
      </section>

      {/* Trending Products */}
      <section className="py-20 px-4 max-w-[1280px] mx-auto border-t border-border">
        <h2 className="font-display text-3xl font-bold text-foreground mb-10 text-center">Trending Discoveries</h2>
        <TrendingProducts />
      </section>

      {/* Top Crafters */}
      <section className="py-20 px-4 bg-muted/30 border-y border-border">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Meet Our Top Artisans</h2>
            <p className="text-muted-foreground max-w-lg">Discover the talented creators behind the beautiful handmade products on Dorovu.</p>
          </div>
          
          <TopCrafters />
        </div>
      </section>
    </div>
  );
}