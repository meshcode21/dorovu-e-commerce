"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, LogOut, UserCircle, Package, Heart, Star, XCircle, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/use-auth";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout } = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sand bg-cream/80 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center">
          <Image 
            src="/dorovu_logo.png" 
            alt="Dorovu Logo" 
            width={140} 
            height={40} 
            className="object-contain"
          />
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-auto hidden md:flex items-center relative">
          <Search className="absolute left-3 w-4 h-4 text-ink-60" />
          <input 
            type="text" 
            placeholder="Search for handmade crafts..." 
            className="w-full h-10 pl-10 pr-4 rounded-full border border-sand bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-forest/50 transition-shadow"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/apply" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex text-forest hover:text-forest hover:bg-forest-subtle" })}>
            Start Selling
          </Link>

          <Button variant="ghost" size="icon" className="text-ink hover:text-forest relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose rounded-full"></span>
          </Button>

          {user ? (
            <div className="flex items-center ml-2 border-l border-sand pl-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 hover:opacity-80 transition-opacity focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-medium text-sm">
                    {user.firstName[0]}
                  </div>
                  <span className="text-sm font-medium hidden md:block text-ink">
                    {user.firstName} {user.lastName}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 bg-white border-sand shadow-lg rounded-xl">
                  {user.role === "ADMIN" && (
                    <>
                      <DropdownMenuItem className="p-0 cursor-pointer text-ink hover:bg-cream rounded-lg group">
                        <Link href="/admin/applications" className="flex items-center w-full p-3">
                          <ShieldCheck className="w-5 h-5 mr-3 text-ink-60 group-hover:text-forest" />
                          <span className="font-medium group-hover:text-forest">Admin Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-sand my-1" />
                    </>
                  )}
                  <DropdownMenuItem className="p-0 cursor-pointer text-ink hover:bg-cream rounded-lg group">
                    <Link href="/profile" className="flex items-center w-full p-3">
                      <UserCircle className="w-5 h-5 mr-3 text-ink-60 group-hover:text-forest" />
                      <span className="font-medium group-hover:text-forest">Manage My Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0 cursor-pointer text-ink hover:bg-cream rounded-lg group">
                    <Link href="/orders" className="flex items-center w-full p-3">
                      <Package className="w-5 h-5 mr-3 text-ink-60 group-hover:text-forest" />
                      <span className="font-medium group-hover:text-forest">My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0 cursor-pointer text-ink hover:bg-cream rounded-lg group">
                    <Link href="/wishlist" className="flex items-center w-full p-3">
                      <Heart className="w-5 h-5 mr-3 text-ink-60 group-hover:text-forest" />
                      <span className="font-medium group-hover:text-forest">My Wishlist & Followed Stores</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0 cursor-pointer text-ink hover:bg-cream rounded-lg group">
                    <Link href="/reviews" className="flex items-center w-full p-3">
                      <Star className="w-5 h-5 mr-3 text-ink-60 group-hover:text-forest" />
                      <span className="font-medium group-hover:text-forest">My Reviews</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-0 cursor-pointer text-ink hover:bg-cream rounded-lg group">
                    <Link href="/returns" className="flex items-center w-full p-3">
                      <XCircle className="w-5 h-5 mr-3 text-ink-60 group-hover:text-forest" />
                      <span className="font-medium group-hover:text-forest">My Returns & Cancellations</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-sand my-1" />
                  <DropdownMenuItem 
                    onClick={() => logout()}
                    className="p-3 cursor-pointer text-error hover:bg-error/10 hover:text-error rounded-lg"
                  >
                    <LogOut className="w-5 h-5 mr-3 opacity-80" />
                    <span className="font-medium">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2 border-l border-sand pl-4">
              <Link href="/login" className={buttonVariants({ variant: "ghost", className: "text-ink hover:text-forest" })}>
                Log in
              </Link>
              <Link href="/register" className={buttonVariants({ variant: "default", className: "bg-forest text-white hover:bg-forest/90 shadow-sm hidden sm:inline-flex" })}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
