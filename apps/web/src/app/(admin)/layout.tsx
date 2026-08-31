"use client";

import { useUser, useLogout } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LogOut, Users, LayoutDashboard, Settings, Tag, Scissors, Truck } from "lucide-react";
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

export default function AdminLayout({
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
      router.push("/login?redirect=/admin/applications");
    } else if (user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background w-full">
        {/* Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarHeader className="p-6 border-b border-sidebar-border">
            <Link href="/admin" className="font-display font-bold text-2xl tracking-tight text-sidebar-foreground">
              Dorovu Admin
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className="p-4 space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={pathname === '/admin'} 
                  render={<Link href="/admin" />}
                >
                  <LayoutDashboard />
                  <span>Overview</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={pathname.includes('/applications')} 
                  render={<Link href="/admin/applications" />}
                >
                  <Users />
                  <span>Applications</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={pathname.includes('/categories')} 
                  render={<Link href="/admin/categories" />}
                >
                  <Tag />
                  <span>Categories</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={pathname.includes('/craft-types')} 
                  render={<Link href="/admin/craft-types" />}
                >
                  <Scissors />
                  <span>Craft Types</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={pathname.includes('/logistics')} 
                  render={<Link href="/admin/logistics" />}
                >
                  <Truck />
                  <span>Logistics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  render={<Link href="/admin" />}
                >
                  <Settings />
                  <span>Settings</span>
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
                <p className="text-xs text-sidebar-foreground/70 truncate">Administrator</p>
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
              <h2 className="text-lg font-semibold text-foreground font-display">
                {pathname.includes('/applications') ? 'Crafter Applications'
                  : pathname.includes('/categories') ? 'Categories'
                    : pathname.includes('/craft-types') ? 'Craft Types'
                      : pathname.includes('/logistics') ? 'Logistics Portal'
                        : 'Dashboard'}
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
