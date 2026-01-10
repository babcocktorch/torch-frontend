"use client";

import { useAtom } from "jotai";
import { torch_ai_sidebar_open } from "@/lib/atoms";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Plus,
  HelpCircle,
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { PAGES } from "@/lib/constants";

interface TorchAISidebarProps {
  onNewChat: () => void;
  onOpenFAQs: () => void;
}

const TorchAISidebar = ({ onNewChat, onOpenFAQs }: TorchAISidebarProps) => {
  const [sidebarOpen, setSidebarOpen] = useAtom(torch_ai_sidebar_open);

  return (
    <aside
      className={cn(
        "border rounded-lg bg-background flex flex-col transition-all duration-300 ease-in-out overflow-hidden shrink-0",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      <div className="flex flex-col h-full p-3">
        {/* Top section with collapse button */}
        <div
          className={cn(
            "flex items-center mb-4",
            sidebarOpen ? "justify-end" : "justify-center"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1 flex-1">
          {/* New Chat */}
          <Button
            variant="ghost"
            className={cn(
              "h-10",
              sidebarOpen
                ? "w-full justify-start gap-3"
                : "w-10 justify-center mx-auto"
            )}
            onClick={onNewChat}
            title="New Chat"
          >
            <Plus className="w-4 h-4 text-gold shrink-0" />
            {sidebarOpen && <span>New Chat</span>}
          </Button>

          {/* FAQs */}
          <Button
            variant="ghost"
            className={cn(
              "h-10",
              sidebarOpen
                ? "w-full justify-start gap-3"
                : "w-10 justify-center mx-auto"
            )}
            onClick={onOpenFAQs}
            title="FAQ's"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>FAQ&apos;s</span>}
          </Button>
        </nav>

        {/* Bottom section - Back to Main Site */}
        <div className="mt-auto pt-4 border-t">
          <Link href={PAGES.home}>
            <Button
              variant="ghost"
              className={cn(
                "h-10 text-muted-foreground hover:text-foreground",
                sidebarOpen
                  ? "w-full justify-start gap-3"
                  : "w-10 justify-center mx-auto"
              )}
              title="Back to Main Site"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Back to Main Site</span>}
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default TorchAISidebar;
