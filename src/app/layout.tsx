import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "The Babcock Torch",
  description: "The Babcock Torch",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className="antialiased relative dark flex flex-col min-h-screen items-center justify-start font-inter">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
