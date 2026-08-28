"use client";

import { useUser, useLogout } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LogOut, Users, LayoutDashboard, Settings, Tag, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="font-display font-bold text-2xl tracking-tight text-white">
            Dorovu Admin
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === '/admin'
              ? 'bg-white/20 text-white font-medium shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>
          <Link
            href="/admin/applications"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.includes('/applications')
              ? 'bg-white/20 text-white font-medium shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <Users className="w-4 h-4" />
            Applications
          </Link>
          <Link
            href="/admin/categories"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.includes('/categories')
              ? 'bg-white/20 text-white font-medium shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <Tag className="w-4 h-4" />
            Categories
          </Link>
          <Link
            href="/admin/craft-types"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname.includes('/craft-types')
              ? 'bg-white/20 text-white font-medium shadow-sm'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
          >
            <Scissors className="w-4 h-4" />
            Craft Types
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-secondary/80 text-white flex items-center justify-center font-medium text-sm shrink-0">
              {user.firstName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-white/50 truncate">Administrator</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => logout()} className="text-white/50 hover:text-secondary/80 hover:bg-secondary/80/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-sand h-16 flex items-center px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground font-display">
            {pathname.includes('/applications') ? 'Crafter Applications' : 'Dashboard'}
          </h2>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
