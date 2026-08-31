"use client";

import Image from "next/image";
import { useAllProducts } from "@/hooks/use-products";
import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop";

export const DynamicHeroImage = () => {
  const { data: products, isLoading } = useAllProducts();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get up to 5 product images
  const productImages = products
    ?.filter((p) => p.images && p.images.length > 0)
    .map((p) => p.images[0])
    .slice(0, 5) || [];

  const displayImages = productImages.length > 0 ? productImages : [FALLBACK_IMAGE];

  useEffect(() => {
    if (displayImages.length <= 1) return;

    // Rotate images every 4 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [displayImages.length]);

  return (
    <div className="flex justify-center relative w-full max-w-md mx-auto aspect-square md:aspect-auto md:w-auto md:h-[500px]">
      <div className="w-60 h-60 md:w-80 md:h-80 bg-secondary/30 rounded-full absolute -top-5 -right-5 md:-top-10 md:-right-10 blur-3xl"></div>
      
      {isLoading ? (
        <div className="w-full h-full md:w-[500px] md:h-[500px] bg-white/10 rounded-2xl animate-pulse z-10 relative" />
      ) : (
        <div className="w-full h-full md:w-[500px] md:h-[500px] relative z-10">
          {displayImages.map((src, index) => (
            <Image
              key={`${src}-${index}`}
              src={src}
              alt="Handmade crafts"
              fill
              className={`rounded-2xl shadow-xl object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
