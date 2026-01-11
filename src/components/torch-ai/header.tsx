"use client";

import { IMAGES, PAGES } from "@/lib/constants";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { app_theme } from "@/lib/atoms";
import IdeaSubmission from "../general/idea-submission";
import Sidebar from "../general/sidebar";
import { Button } from "../ui/button";

const TorchAIHeader = () => {
  const theme = useAtomValue(app_theme);

  const logo =
    theme === "dark" ? IMAGES.logos.logo_white : IMAGES.logos.logo_gold;

  return (
    <header className="w-full bg-background">
      <div className="flex items-center justify-between py-3 px-4">
        {/* Left: Main Site Sidebar */}
        <Sidebar />

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
            </Button>
          }
        />
      </div>
    </header>
  );
};

export default TorchAIHeader;
