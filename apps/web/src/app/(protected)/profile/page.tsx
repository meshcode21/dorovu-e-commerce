"use client";

import { useUser } from "@/hooks/use-auth";
import { useUpdateProfile } from "@/hooks/use-user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProfileSchema, type UpdateProfileDTO } from "@dorovu/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { ShieldCheck, UserCircle, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { data: user } = useUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileDTO>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // Populate form when user data is available
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "", // Always reset password to blank
      });
    }
  }, [user, reset]);

  const onSubmit = (data: UpdateProfileDTO) => {
    // Only send the fields that actually changed or are required to be sent
    const payload: UpdateProfileDTO = {};
    if (data.firstName !== user?.firstName) payload.firstName = data.firstName;
    if (data.lastName !== user?.lastName) payload.lastName = data.lastName;
    if (data.email !== user?.email) payload.email = data.email;
    if (data.password && data.password.trim() !== "") payload.password = data.password;

    // If nothing changed, do not submit
    if (Object.keys(payload).length === 0) return;
    
    updateProfile(payload, {
      onSuccess: () => {
        // Reset password field to blank after successful update
        reset((formValues) => ({
          ...formValues,
          password: "",
        }), { keepDirty: false });
      }
    });
  };

  if (!user) return null; // Let the server-side layout handle the redirect

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Profile
          </h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider mb-1 block">Account Role</Label>
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-primary" />
                {user.role}
              </div>
            </div>
            
            {user.createdAt && (
              <div>
                <Label className="text-muted-foreground text-xs uppercase tracking-wider mb-1 block">Joined</Label>
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="w-4 h-4 text-primary" />
                  {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            )}
            
            <div>
              <Label className="text-muted-foreground text-xs uppercase tracking-wider mb-1 block">Login Method</Label>
              <div className="flex items-center gap-2 font-medium">
                <UserCircle className="w-4 h-4 text-primary" />
                {user.googleId ? "Google OAuth" : "Email / Password"}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
            <h2 className="font-display text-xl font-semibold border-b border-border pb-4">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && <p className="text-destructive text-sm">{errors.firstName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && <p className="text-destructive text-sm">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
              {user.googleId && (
                <p className="text-xs text-muted-foreground">Changing your email will not unlink your Google Account.</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                New Password <span className="text-muted-foreground font-normal">(Leave blank to keep current)</span>
              </Label>
              <Input id="password" type="password" {...register("password")} placeholder="••••••••" />
              {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                disabled={!isDirty || isPending}
                className="w-full sm:w-auto min-w-[120px]"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
