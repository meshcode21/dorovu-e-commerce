import { Card } from "@/components/ui/card";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-4xl text-ink">Dorovu</h1>
          <p className="font-sans text-base text-ink-60 mt-2">Nepal's handmade crafts marketplace</p>
        </div>
        <Card className="p-6 bg-warm-white border-linen shadow-sm rounded-xl">
          {children}
        </Card>
      </div>
    </div>
  );
}
