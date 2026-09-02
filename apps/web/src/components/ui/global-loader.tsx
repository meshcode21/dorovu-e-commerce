"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function GlobalLoader() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  
  // Add a tiny delay to prevent the loader from flashing for very fast requests
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isFetching > 0 || isMutating > 0) {
      timeoutId = setTimeout(() => {
        setShowLoader(true);
      }, 300); // Wait 300ms before showing the overlay
    } else {
      setShowLoader(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isFetching, isMutating]);

  if (!showLoader) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-3xl bg-card shadow-2xl border border-border/50">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-sm font-semibold tracking-wide text-foreground animate-pulse">
          Syncing data...
        </p>
      </div>
    </div>
  );
}
