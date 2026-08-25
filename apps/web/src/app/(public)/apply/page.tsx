"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplyCrafterSchema, type ApplyCrafterDTO } from "@dorovu/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useApplyCrafter } from "@/hooks/use-crafter";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ApplyPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { mutate: apply, isPending } = useApplyCrafter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyCrafterDTO>({
    resolver: zodResolver(ApplyCrafterSchema),
  });

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/apply');
    }
  }, [user, router]);

  const onSubmit = (data: ApplyCrafterDTO) => {
    apply(data);
  };

  if (!user) return null; // Prevent flicker while redirecting

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <div className="mb-12 text-center">
        <h1 className="font-display font-bold text-4xl text-foreground mb-4">Become a Dorovu Crafter</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Join our community of talented Nepali artisans and share your unique handcrafted creations with the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-sand/30 p-6 rounded-xl border border-sand">
            <h3 className="font-semibold text-foreground mb-2">Why sell with us?</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Reach thousands of buyers looking for authentic handmade goods.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Low commission rates designed to support independent creators.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Secure and reliable payment processing directly to your bank.
              </li>
            </ul>
          </div>
        </div>

        <div className="md:col-span-2">
          <Card className="p-8 bg-white border-sand shadow-sm rounded-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  placeholder="e.g. Himalayan Knits"
                  {...register("storeName")}
                />
                {errors.storeName && <p className="text-destructive text-sm">{errors.storeName.message}</p>}
                <p className="text-xs text-muted-foreground/50">This will be your public shop name on Dorovu.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="craftType">Primary Craft Category</Label>
                <select
                  id="craftType"
                  className="w-full h-10 px-3 rounded-lg border border-sand bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  {...register("craftType")}
                >
                  <option value="">Select a category...</option>
                  <option value="CROCHET">Crochet & Knitting</option>
                  <option value="POTTERY">Pottery & Ceramics</option>
                  <option value="JEWELRY">Handmade Jewelry</option>
                  <option value="WOODWORK">Woodwork & Carving</option>
                  <option value="TEXTILES">Textiles & Weaving</option>
                  <option value="OTHER">Other Handmade Art</option>
                </select>
                {errors.craftType && <p className="text-destructive text-sm">{errors.craftType.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Store Description</Label>
                <textarea
                  id="description"
                  placeholder="Tell us about what you make and the story behind your craft..."
                  className="w-full min-h-[120px] p-3 rounded-lg border border-sand bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                  {...register("description")}
                />
                {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8"
                  disabled={isPending}
                >
                  {isPending ? "Submitting Application..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
