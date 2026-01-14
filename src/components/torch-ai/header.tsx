"use client";

import { IMAGES, PAGES } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import IdeaSubmission from "../general/idea-submission";
import Sidebar from "../general/sidebar";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const TorchAIHeader = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const logo = isLargeScreen
    ? IMAGES.logos.logo_gold
    : IMAGES.logos.big_moore_gold;

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="w-full bg-background">
      <div className="flex items-center justify-between p-4">
        {/* Mobile: Logo on left | Desktop: Sidebar trigger on left */}
        <div className="md:block hidden">
          <Sidebar />
        </div>
        <Link
          href={PAGES.home}
          className="flex items-center justify-center md:hidden"
        >
          <Image
            src={logo.src}
            alt="The Babcock Torch"
            width={logo.width}
            height={logo.height}
            className="w-60 h-auto"
          />
        </Link>

        {/* Desktop only: Center Logo */}
        <Link
          href={PAGES.home}
          className="hidden md:flex items-center justify-center"
        >
          <Image
            src={logo.src}
            alt="The Babcock Torch"
            width={logo.width}
            height={logo.height}
            className="w-12 h-auto"
          />
        </Link>

        {/* Mobile: Sidebar trigger on right | Desktop: Talk to torch button */}
        <div className="md:hidden">
          <Sidebar />
        </div>
        <div className="hidden md:block">
          <IdeaSubmission
            trigger={
              <Button variant="outline" className="rounded-full text-sm">
                Talk to the torch
                <span className="ml-1">↗</span>
              </Button>
            }
          />
        </div>
      </div>
    </header>
  );
};

export default TorchAIHeader;
