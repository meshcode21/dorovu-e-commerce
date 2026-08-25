import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, Package } from "lucide-react";
import { TrendingProducts } from "@/components/products/trending-products";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Threaded with love, <br /> made for you.
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md">
              Discover unique, handcrafted treasures from Nepal's most talented artisans. Every piece tells a story.
            </p>
            <div className="flex gap-4">
              <Link
                href="/products"
                className={buttonVariants({
                  size: "lg",
                  className: "bg-white !text-primary hover:!bg-background shadow-md font-semibold px-8"
                })}
              >
                Shop Now
              </Link>
              <Link
                href="/apply"
                className={buttonVariants({
                  size: "lg",
                  className: "border-white text-white bg-transparent hover:bg-white/10"
                })}
              >
                Start Selling
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center relative">
            <div className="w-80 h-80 bg-secondary/30 rounded-full absolute -top-10 -right-10 blur-3xl"></div>
            <Image
              src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop"
              alt="Handmade crafts"
              width={500}
              height={500}
              className="rounded-2xl shadow-xl object-cover aspect-square z-10 relative"
            />
          </div>
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Crochet", image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=400&auto=format&fit=crop" },
            { name: "Pottery", image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=400&auto=format&fit=crop" },
            { name: "Jewelry", image: "https://images.unsplash.com/photo-1599643477873-ce830919fcd4?q=80&w=400&auto=format&fit=crop" },
            { name: "Woodwork", image: "https://images.unsplash.com/photo-1611486212557-88be5ff6f941?q=80&w=400&auto=format&fit=crop" }
          ].map((category) => (
            <Link href={`/products?category=${category.name.toLowerCase()}`} key={category.name} className="group block">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-muted">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 px-4 max-w-[1280px] mx-auto border-t border-border">
        <h2 className="font-display text-3xl font-bold text-foreground mb-10 text-center">Trending Discoveries</h2>
        <TrendingProducts />
      </section>
    </div>
  );
}