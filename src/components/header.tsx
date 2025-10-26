"use client";

import { app_theme, is_categories_at_viewport_edge } from "@/lib/atoms";
import { IMAGES } from "@/lib/constants";
import { useAtomValue } from "jotai";
import Image from "next/image";
import ThemeToggle from "./general/theme-toggle";
import { Button } from "./ui/button";
import Sidebar from "./general/sidebar";
import { cn } from "@/lib/utils";

const Header = () => {
  const theme = useAtomValue(app_theme);
  const isCategoriesAtViewportEdge = useAtomValue(
    is_categories_at_viewport_edge
  );

  const logo =
    theme === "dark"
      ? IMAGES.logos.engravers_old_eng_white
      : IMAGES.logos.engravers_old_eng_gold;

  return (
    <header className="sticky top-0 z-50 w-full dark:bg-black bg-white border flex items-center justify-between py-4 px-6 gap-4">
      <Sidebar />

      <div
        className={cn(
          "flex items-center justify-center flex-col gap-1 transition-all",
          isCategoriesAtViewportEdge ? "" : "lg:opacity-0"
        )}
      >
        <Image
          src={logo.src}
          alt="The Babcock Torch"
          width={logo.width}
          height={logo.height}
          className="w-40 sm:w-48 h-auto"
        />

        <p className="font-miller text-xs text-muted-foreground hidden lg:block">
          The University Daily, Est. 2025
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button className="hidden lg:block dark:bg-white dark:text-black text-white bg-black">
          Talk to the Torch
        </Button>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
