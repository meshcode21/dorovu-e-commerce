import { Card } from "@/components/ui/card";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (token) {
    redirect("/");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <Image 
            src="/dorovu_logo.png" 
            alt="Dorovu Logo" 
            width={280} 
            height={80} 
            priority
            className="mb-4"
          />
          <p className="font-sans text-base text-muted-foreground">Nepal's handmade crafts marketplace</p>
        </div>
        <Card className="p-6 bg-white border-sand shadow-sm rounded-xl">
          {children}
        </Card>
      </div>
    </div>
  );
}
