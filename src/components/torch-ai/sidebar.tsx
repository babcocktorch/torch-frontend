"use client";

import { useAtomValue } from "jotai";
import { torch_ai_sidebar_open } from "@/lib/atoms";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Plus, HelpCircle, ExternalLink, Copy } from "lucide-react";
import Link from "next/link";
import { PAGES } from "@/lib/constants";

interface TorchAISidebarProps {
  onNewChat: () => void;
  onOpenFAQs: () => void;
}

const TorchAISidebar = ({ onNewChat, onOpenFAQs }: TorchAISidebarProps) => {
  const sidebarOpen = useAtomValue(torch_ai_sidebar_open);

  return (
    <aside
      className={cn(
        "h-full border-r bg-background flex flex-col transition-all duration-300 ease-in-out overflow-hidden",
        sidebarOpen ? "w-64" : "w-0"
      )}
    >
      <div className="flex flex-col h-full p-3 min-w-64">
        {/* Top section */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground"></span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Copy chat"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1 flex-1">
          {/* New Chat */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={onNewChat}
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>New Chat</span>
          </Button>

          {/* FAQs */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10"
            onClick={onOpenFAQs}
          >
            <HelpCircle className="w-4 h-4" />
            <span>FAQ&apos;s</span>
          </Button>
        </nav>

        {/* Bottom section - Back to Main Site */}
        <div className="mt-auto pt-4 border-t">
          <Link href={PAGES.home}>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-10 text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Back to Main Site</span>
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default TorchAISidebar;
