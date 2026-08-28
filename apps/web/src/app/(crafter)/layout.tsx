"use client";

import { useUser, useLogout } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LogOut, Store, LayoutDashboard, Settings, Package, ShoppingBag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function CrafterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login?redirect=/crafter");
    } else if (user.role !== "CRAFTER") {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand/20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== "CRAFTER") return null;

  return (
    <div className="flex min-h-screen bg-sand/20">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-primary-subtle">
          <Link href="/crafter" className="font-display font-bold text-2xl tracking-tight text-white flex items-center gap-2">
            <Store className="w-6 h-6" />
            My Shop
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/crafter"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === '/crafter'
              ? 'bg-white/20 text-white font-medium shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>
          <Link
            href="/crafter/products"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.includes('/products')
              ? 'bg-white/20 text-white font-medium shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <Package className="w-4 h-4" />
            Products
          </Link>
          <Link
            href="/crafter/orders"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.includes('/orders')
              ? 'bg-white/20 text-white font-medium shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders
          </Link>
          <Link
            href="/crafter/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.includes('/settings')
              ? 'bg-white/20 text-white font-medium shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <Settings className="w-4 h-4" />
            Shop Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-primary-subtle">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-secondary/80 text-white flex items-center justify-center font-medium text-sm shrink-0">
              {user.firstName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-white/50 truncate">Crafter</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => logout()} className="text-white/50 hover:text-secondary/80 hover:bg-secondary/80/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-sand h-16 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground font-display capitalize">
            {pathname.split('/').pop() === 'crafter' ? 'Overview' : pathname.split('/').pop()}
          </h2>
          <Link href="/" className={buttonVariants({ variant: "outline", className: "border-primary-subtle text-primary hover:bg-primary/5" })}>
            View Storefront
          </Link>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
