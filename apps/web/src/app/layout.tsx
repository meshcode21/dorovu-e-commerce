import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dorovu",
  description: "Nepal's handmade crafts marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
