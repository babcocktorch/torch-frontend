"use client";

import { IMAGES, PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";
import { app_theme } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IoIosArrowForward } from "react-icons/io";
import { ComingSoonProps } from "@/lib/types";

const ComingSoon = ({
  title = "Coming Soon",
  description = "Our editorial team is hard at work preparing this section. Check back soon for exciting new content from The Babcock Torch.",
  showReturnButton = true,
}: ComingSoonProps) => {
  const theme = useAtomValue(app_theme);

  const logo =
    theme === "dark" ? IMAGES.logos.logo_white : IMAGES.logos.logo_gold;

  return (
    <main className="w-full max-w-7xl flex flex-col items-center justify-center flex-1 px-6 py-12 lg:py-24">
      <div className="w-full flex flex-col items-center justify-center gap-8 text-center">
        {/* Torch Logo */}
        <Image
          src={logo.src}
          alt="The Babcock Torch"
          width={80}
          height={80}
          className="w-20 h-20 opacity-50"
        />

        {/* Coming Soon Heading */}
        <div className="flex flex-col gap-4">
          <h1 className="font-miller text-6xl lg:text-7xl font-bold text-gold dark:text-white">
            {title}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-border" />
            <p
              className={cn("text-sm text-muted-foreground", domine.className)}
            >
              IN DEVELOPMENT
            </p>
            <div className="h-px w-16 bg-border" />
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
            {description}
          </p>
        </div>

        {/* Call to Action */}
        {showReturnButton && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
            <Link href={PAGES.home}>
              <button className="group flex items-center justify-center gap-2 px-6 py-3 bg-gold text-white font-medium rounded-sm hover:bg-gold/90 transition-all hover:gap-3">
                Return to Front Page
                <IoIosArrowForward className="transition-all" />
              </button>
            </Link>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t w-full max-w-2xl">
          <p className="text-sm text-muted-foreground">
            Have suggestions for this section? We&apos;d love to hear from you.
          </p>
        </div>
      </div>
    </main>
  );
};

export default ComingSoon;
