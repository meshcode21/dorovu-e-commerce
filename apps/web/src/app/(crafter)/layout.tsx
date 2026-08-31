"use client";

import { useUser, useLogout } from "@/hooks/use-auth";
import { useCrafterStore } from "@/hooks/use-crafter-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LogOut, Store, LayoutDashboard, Settings, Package, ShoppingBag, Banknote } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

export default function CrafterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  const { data: store, isLoading: isStoreLoading } = useCrafterStore(user?.id);
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
    <SidebarProvider>
      <div className="flex min-h-screen bg-sand/20 w-full">
        {/* Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarHeader className="p-6 border-b border-sidebar-border">
            <Link href="/crafter" className="font-display font-bold text-2xl tracking-tight text-sidebar-foreground flex items-center gap-2">
              <Store className="w-6 h-6" />
              My Shop
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className="p-4 space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={pathname === '/crafter'} 
                  render={<Link href="/crafter" />}
                >
                  <LayoutDashboard />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={pathname.includes('/products')} 
                  render={<Link href="/crafter/products" />}
                >
                  <Package />
                  <span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={pathname.includes('/orders')} 
                  render={<Link href="/crafter/orders" />}
                >
                  <ShoppingBag />
                  <span>Orders</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={pathname.includes('/payouts')} 
                  render={<Link href="/crafter/payouts" />}
                >
                  <Banknote />
                  <span>Payouts & Accounting</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={pathname.includes('/settings')} 
                  render={<Link href="/crafter/settings" />}
                >
                  <Settings />
                  <span>Shop Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent text-sidebar-accent-foreground flex items-center justify-center font-medium text-sm shrink-0">
                {user.firstName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">Crafter</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => logout()} className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <header className="bg-white border-b border-sand h-16 flex items-center justify-between px-4 md:px-8 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden text-primary" />
              <h2 className="text-lg font-semibold text-foreground font-display capitalize">
                {isStoreLoading ? "Loading Shop..." : store?.storeName || "My Shop"}
              </h2>
            </div>
            <Link href="/" className={buttonVariants({ variant: "outline", className: "border-primary-subtle text-primary hover:bg-primary/5 hidden sm:inline-flex" })}>
              View Storefront
            </Link>
          </header>
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
