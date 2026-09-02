import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-6" />
      <p className="text-xl font-display text-muted-foreground animate-pulse tracking-wide">
        Loading amazing crafts...
      </p>
    </div>
  );
}
