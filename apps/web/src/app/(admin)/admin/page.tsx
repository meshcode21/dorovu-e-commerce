"use client";

import { useApplications } from "@/hooks/use-admin";
import { Card } from "@/components/ui/card";
import { Users, LayoutDashboard, Store } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function AdminOverviewPage() {
  const { data: applications, isLoading } = useApplications();

  const pendingCount = applications?.filter(app => app.status === 'PENDING').length || 0;
  const approvedCount = applications?.filter(app => app.status === 'APPROVED').length || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-border shadow-sm justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Applications</p>
              <h3 className="text-2xl font-display font-bold text-foreground">
                {isLoading ? "-" : pendingCount}
              </h3>
            </div>
          </div>
          {pendingCount > 0 && (
            <Link href="/admin/applications" className={buttonVariants({ variant: "outline", className: "w-full text-xs" })}>
              Review Now
            </Link>
          )}
        </Card>

        <Card className="p-6 bg-white border-border shadow-sm justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approved Crafters</p>
              <h3 className="text-2xl font-display font-bold text-foreground">
                {isLoading ? "-" : approvedCount}
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-border shadow-sm justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-muted-foreground/10 text-muted-foreground rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Health</p>
              <h3 className="text-xl font-display font-bold text-primary">Online</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white border border-border rounded-xl p-8 text-center mt-12">
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">Welcome to the Admin Dashboard</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          From here you can manage all aspects of the Dorovu platform. Start by reviewing pending crafter applications.
        </p>
        <Link href="/admin/applications" className={buttonVariants({ className: "bg-primary text-white hover:bg-primary/90" })}>
          View Applications
        </Link>
      </div>
    </div>
  );
}
