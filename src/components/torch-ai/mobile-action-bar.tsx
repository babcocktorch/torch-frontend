"use client";

import { Button } from "../ui/button";
import { Plus, HelpCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PAGES } from "@/lib/constants";

interface TorchAIMobileActionBarProps {
  onNewChat: () => void;
  onOpenFAQs: () => void;
}

const TorchAIMobileActionBar = ({
  onNewChat,
  onOpenFAQs,
}: TorchAIMobileActionBarProps) => {
  return (
    <div className="flex md:hidden items-center justify-between px-4 py-2 border-b bg-background">
      {/* Left: Back to Main Site */}
      <Link href={PAGES.home}>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          title="Back to Main Site"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </Link>

      {/* Right: New Chat and FAQ icons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={onNewChat}
          title="New Chat"
        >
          <Plus className="w-4 h-4 text-gold" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={onOpenFAQs}
          title="FAQs"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TorchAIMobileActionBar;

