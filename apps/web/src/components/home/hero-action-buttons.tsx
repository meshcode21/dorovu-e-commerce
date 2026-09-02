"use client";

import Link from "next/link";
import { useUser } from "@/hooks/use-auth";
import { buttonVariants } from "@/components/ui/button";
import { Store, ShieldCheck, Sparkles } from "lucide-react";

export function HeroActionButtons() {
  const { data: user, isLoading } = useUser();

  const renderSecondaryButton = () => {
    if (isLoading) {
      return (
        <div
          className={buttonVariants({
            size: "lg",
            className: "border-white/50 text-white/50 bg-transparent w-full sm:w-auto pointer-events-none"
          })}
        >
          Start Selling
        </div>
      );
    }

    if (user?.role === "CRAFTER") {
      return (
        <Link
          href="/crafter"
          className={buttonVariants({
            size: "lg",
            className: "border-white text-white bg-white/10 hover:bg-white/20 font-medium backdrop-blur-sm w-full sm:w-auto inline-flex items-center justify-center gap-2"
          })}
        >
          <Store className="w-4 h-4" />
          Crafter Studio
        </Link>
      );
    }

    if (user?.role === "ADMIN") {
      return (
        <Link
          href="/admin"
          className={buttonVariants({
            size: "lg",
            className: "border-white text-white bg-white/10 hover:bg-white/20 font-medium backdrop-blur-sm w-full sm:w-auto inline-flex items-center justify-center gap-2"
          })}
        >
          <ShieldCheck className="w-4 h-4" />
          Admin Portal
        </Link>
      );
    }

    // Default for Guests and BUYER role
    return (
      <Link
        href="/apply"
        className={buttonVariants({
          size: "lg",
          className: "border-white text-white bg-transparent hover:bg-white/10 w-full sm:w-auto inline-flex items-center justify-center gap-2"
        })}
      >
        <Sparkles className="w-4 h-4" />
        Start Selling
      </Link>
    );
  };

  return (
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
      {renderSecondaryButton()}
    </div>
  );
}
