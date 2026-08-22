"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterDTO } from "@dorovu/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRegister } from "@/hooks/use-auth";

export default function RegisterPage() {
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDTO>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = (data: RegisterDTO) => {
    registerUser(data);
  };

  return (
    <div>
      <h2 className="font-display font-semibold text-2xl text-ink mb-6 text-center">Join Dorovu</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" placeholder="Ram" {...register("firstName")} />
            {errors.firstName && <p className="text-error text-sm">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" placeholder="Thapa" {...register("lastName")} />
            {errors.lastName && <p className="text-error text-sm">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
          {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full bg-clay hover:bg-clay-light text-white" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-ink-60">
        Already have an account?{" "}
        <Link href="/login" className="text-clay hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </div>
  );
}
