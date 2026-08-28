"use client";

import { Card } from "@/components/ui/card";
import { Package, ShoppingBag, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useUser } from "@/hooks/use-auth";

export default function CrafterOverviewPage() {
  const { data: user } = useUser();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Welcome back, {user?.firstName}!</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your shop today.</p>
        </div>
        <Link
          href="/crafter/products/new"
          className={buttonVariants({ className: "bg-primary text-white hover:bg-primary/90 shadow-sm" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-sand shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
              <h3 className="text-2xl font-display font-bold text-foreground">Rs. 0</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-sand shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-secondary/80/10 text-secondary/80 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
              <h3 className="text-2xl font-display font-bold text-foreground">0</h3>
            </div>
          </div>
          <Link href="/crafter/orders" className={buttonVariants({ variant: "outline", className: "w-full text-xs mt-2" })}>
            View Orders
          </Link>
        </Card>

        <Card className="p-6 bg-white border-sand shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-ink-10 text-muted-foreground rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Live Products</p>
              <h3 className="text-2xl font-display font-bold text-foreground">0</h3>
            </div>
          </div>
          <Link href="/crafter/products" className={buttonVariants({ variant: "outline", className: "w-full text-xs mt-2" })}>
            Manage Products
          </Link>
        </Card>
      </div>

      <div className="bg-background border border-sand rounded-xl p-8 text-center mt-12 shadow-inner">
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">Ready to start selling?</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Your shop is empty! Start by adding your first handcrafted product to your catalog.
        </p>
        <Link href="/crafter/products/new" className={buttonVariants({ className: "bg-primary text-white hover:bg-primary/90" })}>
          <Plus className="w-4 h-4 mr-2" /> Add Your First Product
        </Link>
      </div>
    </div>
  );
}
