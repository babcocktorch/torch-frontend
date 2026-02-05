import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "The Babcock Torch",
  description: "The Babcock Torch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased relative flex flex-col min-h-screen items-center justify-start",
        )}
      >
        {children}
      </body>
    </html>
  );
}
