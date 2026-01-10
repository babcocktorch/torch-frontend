import type { Metadata } from "next";
import "../globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Ask the Torch AI | The Babcock Torch",
  description:
    "Ask the Torch AI is a tool that allows you to ask questions about the Babcock Torch.",
};

const TorchAILayout = ({
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
        {children}
      </body>
    </html>
  );
};

export default TorchAILayout;
