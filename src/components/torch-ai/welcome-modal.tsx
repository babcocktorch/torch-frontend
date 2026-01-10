"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "torch-ai-terms-accepted";

const TorchAIWelcomeModal = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage on mount
    const hasAccepted = localStorage.getItem(STORAGE_KEY);
    if (!hasAccepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-xl"
      >
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-xl sm:text-2xl font-normal mb-2 font-miller">
            Welcome to the Torch AI
          </DialogTitle>
          <DialogDescription className="text-foreground/80 leading-relaxed">
            The Torch AI was built with ❤️ and help from GDG Babcock&apos;s Data
            & AI Team. It is Powered by the Babcock University Knowledge Graph
            (BUKG).
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 mt-4">
          <Button
            onClick={handleAccept}
            className="w-full bg-gold hover:bg-gold/90 text-white rounded-full py-6 font-medium"
          >
            I Understand & Agree
          </Button>
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <span className="underline cursor-pointer">Terms of Use</span>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TorchAIWelcomeModal;
