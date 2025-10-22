import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased dark flex flex-col min-h-screen items-center justify-start font-georgia">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
