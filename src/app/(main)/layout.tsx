import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "The Babcock Torch",
  description: "The Babcock Torch",
};

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased relative flex flex-col min-h-screen items-center justify-start"
        )}
      >
        <Toaster position="top-center" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default MainLayout;
