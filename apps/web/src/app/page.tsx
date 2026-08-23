"use client";

import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const { mutate: logout, isPending } = useLogout();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-display font-bold mb-4">Dorovu Home</h1>
      
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ink-10 max-w-md">
          <h2 className="text-xl font-semibold mb-2">Welcome, {user.firstName}!</h2>
          <p className="text-ink-60 mb-4">Email: {user.email}</p>
          <Button 
            onClick={() => logout()} 
            disabled={isPending}
            variant="outline"
          >
            {isPending ? "Logging out..." : "Log out"}
          </Button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </main>
  );
}