"use client";

import { IMAGES, PAGES } from "@/lib/constants";
import { useAtom, useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { app_theme, torch_ai_sidebar_open } from "@/lib/atoms";
import IdeaSubmission from "../general/idea-submission";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "../ui/button";

const TorchAIHeader = () => {
  const theme = useAtomValue(app_theme);
  const [sidebarOpen, setSidebarOpen] = useAtom(torch_ai_sidebar_open);

  const logo =
    theme === "dark" ? IMAGES.logos.logo_white : IMAGES.logos.logo_gold;

  return (
    <header className="w-full border-b bg-background">
      <div className="flex items-center justify-between py-3 px-4">
        {/* Left: Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </Button>

        {/* Center: Logo */}
        <Link href={PAGES.home} className="flex items-center justify-center">
          <Image
            src={logo.src}
            alt="The Babcock Torch"
            width={logo.width}
            height={logo.height}
            className="w-8 h-auto"
          />
        </Link>

        {/* Right: Talk to the Torch button */}
        <IdeaSubmission
          trigger={
            <Button variant="outline" className="rounded-full text-sm">
              Talk to the torch
              <span className="ml-1">↗</span>
            </Button>
          }
        />
      </div>
    </header>
  );
};

export default TorchAIHeader;
