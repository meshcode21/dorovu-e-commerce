"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginDTO } from "@dorovu/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLogin } from "@/hooks/use-auth";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginDTO) => {
    login(data);
  };

  return (
    <div>
      <h2 className="font-display font-semibold text-2xl text-ink mb-6 text-center">Welcome back</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-clay hover:bg-clay-light text-white" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-ink-60">
        Don't have an account?{" "}
        <Link href="/register" className="text-clay hover:underline font-medium">
          Create one
        </Link>
      </div>
    </div>
  );
}
