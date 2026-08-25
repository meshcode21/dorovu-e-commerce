import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  console.log(cookieStore)
  console.log(token)
  if (!token) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-background">
        {children}
      </main>
      <Footer />
    </div>
  );
}
