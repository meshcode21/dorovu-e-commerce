import type { Metadata } from "next";
import "./globals.css";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/components/providers/query-provider";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Dorovu",
  description: "Nepal's handmade crafts marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans antialiased", inter.variable, playfair.variable, jetbrainsMono.variable)}>
      <body className="min-h-screen bg-background font-sans">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
