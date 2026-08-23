import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, Package } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-forest text-white py-20 px-4">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
              Threaded with love, <br/> made for you.
            </h1>
            <p className="text-forest-subtle text-lg mb-8 max-w-md">
              Discover unique, handcrafted treasures from Nepal's most talented artisans. Every piece tells a story.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/products" 
                className={buttonVariants({ 
                  size: "lg", 
                  className: "bg-white text-forest hover:bg-cream hover:text-forest shadow-md font-semibold px-8" 
                })}
                style={{ color: "#2E4A3F", backgroundColor: "#ffffff" }}
              >
                Shop Now
              </Link>
              <Link 
                href="/apply" 
                className={buttonVariants({ 
                  size: "lg", 
                  variant: "outline", 
                  className: "border-white text-white bg-transparent hover:bg-white/10" 
                })}
                style={{ color: "#ffffff", borderColor: "#ffffff" }}
              >
                Start Selling
              </Link>
            </div>
          </div>
          <div className="hidden md:flex justify-center relative">
            <div className="w-80 h-80 bg-rose/20 rounded-full absolute -top-10 -right-10 blur-3xl"></div>
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
      <section className="py-16 bg-sand/30 border-b border-sand">
        <div className="max-w-[1280px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6">
            <div className="w-12 h-12 bg-rose-subtle text-rose rounded-full flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2 text-ink">Handmade with Love</h3>
            <p className="text-ink-60 text-sm">Every item on Dorovu is carefully crafted by independent artisans.</p>
          </div>
          <div className="flex flex-col items-center p-6">
            <div className="w-12 h-12 bg-forest-subtle text-forest rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2 text-ink">Unique & Authentic</h3>
            <p className="text-ink-60 text-sm">Find one-of-a-kind pieces that you won't see anywhere else.</p>
          </div>
          <div className="flex flex-col items-center p-6">
            <div className="w-12 h-12 bg-[#EAD6C8] text-[#8A7A76] rounded-full flex items-center justify-center mb-4">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-2 text-ink">Secure Delivery</h3>
            <p className="text-ink-60 text-sm">Safe and reliable shipping directly from the creator to your door.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 max-w-[1280px] mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink mb-2">Shop by Category</h2>
            <p className="text-ink-60">Explore our wide range of handcrafted goods</p>
          </div>
          <Link href="/categories" className="text-forest font-medium flex items-center gap-1 hover:underline">
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
            <Link href={`/category/${category.name.toLowerCase()}`} key={category.name} className="group block">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-sand">
                <Image 
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-display font-semibold text-lg text-ink group-hover:text-forest transition-colors">{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products Placeholder */}
      <section className="py-20 px-4 max-w-[1280px] mx-auto border-t border-sand">
        <h2 className="font-display text-3xl font-bold text-ink mb-10 text-center">Trending Discoveries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-sand overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative aspect-square bg-cream">
                <div className="absolute inset-0 flex items-center justify-center text-ink-30 text-sm">
                  Product Image
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs font-mono text-rose uppercase tracking-wider mb-1">Category</div>
                <h3 className="font-medium text-ink truncate mb-1">Handcrafted Item {i}</h3>
                <p className="text-sm text-ink-60 mb-3">By Artisan Name</p>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-forest">Rs. 1,500</span>
                  <Button size="sm" variant="outline" className="h-8 rounded-full border-sand hover:border-forest hover:text-forest">
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}