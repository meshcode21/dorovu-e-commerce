import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Dorovu",
  description: "Nepal's handmade crafts marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans antialiased", inter.variable, playfair.variable, jetbrainsMono.variable)}>
      <body className="antialiased min-h-screen flex flex-col">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
