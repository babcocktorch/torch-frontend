"use client";

import { app_theme, is_categories_at_viewport_edge } from "@/lib/atoms";
import { IMAGES, PAGES } from "@/lib/constants";
import { useAtomValue } from "jotai";
import Image from "next/image";
import ThemeToggle from "./general/theme-toggle";
import Sidebar from "./general/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { domine } from "@/lib/fonts";
import Link from "next/link";

const Header = () => {
  const theme = useAtomValue(app_theme);
  const isCategoriesAtViewportEdge = useAtomValue(
    is_categories_at_viewport_edge
  );

  const pathname = usePathname();

  const shouldShowLogo =
    pathname.includes("/post") ||
    pathname.includes("/search") ||
    pathname.includes("/opinion");

  const logo =
    theme === "dark"
      ? IMAGES.logos.engravers_old_eng_white
      : IMAGES.logos.big_moore_gold;
  // : IMAGES.logos.engravers_old_eng_black;

  return (
    <header className="sticky top-0 z-50 w-full dark:bg-black bg-white border flex items-center justify-between py-4 px-6 gap-4">
      <Sidebar />

      <div
        className={cn(
          "flex items-center justify-center flex-col gap-1 transition-all",
          shouldShowLogo || isCategoriesAtViewportEdge ? "" : "lg:opacity-0"
        )}
      >
        <Link href={PAGES.home}>
          <Image
            src={logo.src}
            alt="The Babcock Torch"
            width={logo.width}
            height={logo.height}
            className={cn(
              "w-40 sm:w-48 h-auto",
              theme === "dark" ? "mb-0" : "mb-2"
            )}
          />
        </Link>

        <p
          className={cn(
            "text-xs text-muted-foreground hidden lg:block",
            domine.className
          )}
        >
          The University Daily, Est. 2025
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        {/* <IdeaSubmission /> */}

        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
