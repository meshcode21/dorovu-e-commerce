"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ShoppingCart, LogOut, UserCircle, Package, Heart, Star, XCircle } from "lucide-react";
import { useUser, useLogout } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { usePendingOrdersCount } from "@/hooks/use-orders";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- SHARED COMPONENTS ---

function Logo() {
  return (
    <Link href="/" className="shrink-0 flex items-center">
      <Image
        src="/dorovu_logo.png"
        alt="Dorovu Logo"
        width={140}
        height={40}
        className="object-contain"
      />
    </Link>
  );
}

function SearchBox() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/products`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto hidden md:flex items-center relative">
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for handmade crafts..."
        className="w-full h-10 pl-10 pr-4 rounded-full border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
      />
    </form>
  );
}

function CartButton() {
  const { data: user } = useUser();
  const { data: cart } = useCart(!!user);
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="text-foreground hover:text-primary relative">
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold">
            {itemCount}
          </span>
        )}
      </Button>
    </Link>
  );
}

function AuthButtons() {
  return (
    <div className="flex items-center gap-2 ml-2 border-l border-border pl-4">
      <Link href="/login" className={buttonVariants({ variant: "ghost", className: "text-foreground hover:text-primary" })}>
        Log in
      </Link>
      <Link href="/register" className={buttonVariants({ variant: "default", className: "bg-primary text-white hover:bg-primary/90 shadow-sm hidden sm:inline-flex" })}>
        Sign up
      </Link>
    </div>
  );
}

function UserDropdown({ user, logout }: { user: any; logout: () => void }) {
  return (
    <div className="flex items-center ml-2 border-l border-border pl-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-black/5 hover:opacity-80 transition-opacity focus:outline-none">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">
            {user.firstName[0]}
          </div>
          <span className="text-sm font-medium hidden md:block text-foreground">
            {user.firstName} {user.lastName}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-2 bg-white border-border shadow-lg rounded-xl">
          <DropdownMenuItem className="p-0 cursor-pointer text-foreground hover:bg-background rounded-lg group">
            <Link href="/profile" className="flex items-center w-full p-3">
              <UserCircle className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-primary" />
              <span className="font-medium group-hover:text-primary">Manage My Account</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 cursor-pointer text-foreground hover:bg-background rounded-lg group">
            <Link href="/orders" className="flex items-center w-full p-3">
              <Package className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-primary" />
              <span className="font-medium group-hover:text-primary">My Orders</span>
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="p-0 cursor-pointer text-foreground hover:bg-background rounded-lg group">
            <Link href="/wishlist" className="flex items-center w-full p-3">
              <Heart className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-primary" />
              <span className="font-medium group-hover:text-primary">My Wishlist & Followed Stores</span>
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem className="p-0 cursor-pointer text-foreground hover:bg-background rounded-lg group">
            <Link href="/reviews" className="flex items-center w-full p-3">
              <Star className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-primary" />
              <span className="font-medium group-hover:text-primary">My Reviews</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 cursor-pointer text-foreground hover:bg-background rounded-lg group">
            <Link href="/returns" className="flex items-center w-full p-3">
              <XCircle className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-primary" />
              <span className="font-medium group-hover:text-primary">My Returns & Cancellations</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border my-1" />
          <DropdownMenuItem
            onClick={() => logout()}
            className="p-3 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
          >
            <LogOut className="w-5 h-5 mr-3 opacity-80" />
            <span className="font-medium">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// --- NAVBAR VARIANTS ---

export function NavbarPublic() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Logo />
        <SearchBox />
        <div className="flex items-center gap-2 shrink-0">
          <CartButton />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}

export function NavbarAdmin() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Logo />
        <SearchBox />
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/admin" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex text-primary hover:text-primary hover:bg-accent-foreground" })}>
            Admin Dashboard
          </Link>
          <CartButton />
          {user && <UserDropdown user={user} logout={logout} />}
        </div>
      </div>
    </header>
  );
}

export function NavbarBuyer() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Logo />
        <SearchBox />
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/apply" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex text-primary hover:text-primary hover:bg-accent-foreground" })}>
            Start Selling
          </Link>
          <CartButton />
          {user && <UserDropdown user={user} logout={logout} />}
        </div>
      </div>
    </header>
  );
}

export function NavbarCrafter() {
  const { data: user } = useUser();
  const { mutate: logout } = useLogout();
  const { data: pendingCount } = usePendingOrdersCount();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Logo />
        <SearchBox />
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/crafter/orders" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex text-primary hover:text-primary hover:bg-accent-foreground relative" })}>
            Orders
            {pendingCount ? (
              <Badge variant="destructive" className="absolute -top-0.5 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]">
                {pendingCount > 9 ? '9+' : pendingCount}
              </Badge>
            ) : null}
          </Link>
          <Link href="/crafter" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex text-primary hover:text-primary hover:bg-accent-foreground" })}>
            My Store
          </Link>
          <CartButton />
          {user && <UserDropdown user={user} logout={logout} />}
        </div>
      </div>
    </header>
  );
}

// --- MAIN EXPORT ---

export function Navbar() {
  const { data: user } = useUser();

  if (!user) return <NavbarPublic />;
  if (user.role === "ADMIN") return <NavbarAdmin />;
  if (user.role === "CRAFTER") return <NavbarCrafter />;
  return <NavbarBuyer />;
}
