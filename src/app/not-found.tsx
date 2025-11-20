"use client";

import { IMAGES, PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";
import { app_theme } from "@/lib/atoms";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IoIosArrowForward } from "react-icons/io";

const NotFound = () => {
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

        {/* 404 Heading */}
        <div className="flex flex-col gap-4">
          <h1 className="font-miller text-8xl lg:text-9xl font-bold text-gold dark:text-white">
            404
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-border" />
            <p
              className={cn("text-sm text-muted-foreground", domine.className)}
            >
              PAGE NOT FOUND
            </p>
            <div className="h-px w-16 bg-border" />
          </div>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-4 max-w-2xl">
          {/* <h2 className="font-miller text-2xl lg:text-3xl font-semibold">
            Page Not Found
          </h2> */}
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
            The page you&apos;re looking for has either been moved, deleted, or
            never existed in our archives. Even our best reporters couldn&apos;t
            track it down.
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <Link href={PAGES.home}>
            <button className="group flex items-center justify-center gap-2 px-6 py-3 bg-gold text-white font-medium rounded-sm hover:bg-gold/90 transition-all hover:gap-3">
              Return to Front Page
              <IoIosArrowForward className="transition-all" />
            </button>
          </Link>
          <Link href={PAGES.search()}>
            <button className="flex items-center justify-center gap-2 px-6 py-3 border border-border bg-transparent font-medium rounded-sm hover:bg-accent transition-all">
              Search Archives
            </button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t w-full max-w-2xl">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact our editorial team.
          </p>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
