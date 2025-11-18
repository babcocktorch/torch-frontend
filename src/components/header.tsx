"use client";

import { app_theme } from "@/lib/atoms";
import { IMAGES, PAGES, MAJOR_CATEGORIES } from "@/lib/constants";
import { useAtomValue } from "jotai";
import Image from "next/image";
import ThemeToggle from "./general/theme-toggle";
import Sidebar from "./general/sidebar";
import { cn } from "@/lib/utils";
import { domine } from "@/lib/fonts";
import Link from "next/link";
import IdeaSubmission from "./general/idea-submission";
import { useEffect, useRef, useState } from "react";
import { FaYoutube } from "react-icons/fa";
import { Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { getWeather } from "@/lib/requests";

const Header = () => {
  const theme = useAtomValue(app_theme);

  const pathname = usePathname();

  const shouldShowLogo = true;
  const [weather, setWeather] = useState({ temp: 0, condition: "" });
  const [isLargeHeaderVisible, setIsLargeHeaderVisible] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const largeHeaderRef = useRef<HTMLDivElement | null>(null);

  const logo =
    theme === "dark"
      ? IMAGES.logos.engravers_old_eng_white
      : IMAGES.logos.big_moore_gold;

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  useEffect(() => {
    const fetchWeather = async () => {
      const weather = await getWeather();

      setWeather(weather);
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    if (!largeHeaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsLargeHeaderVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px",
      }
    );

    observer.observe(largeHeaderRef.current);

    return () => {
      if (largeHeaderRef.current) observer.unobserve(largeHeaderRef.current);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Show small header when large header is off screen OR on small screens
  const showSmallHeader = !isLargeHeaderVisible || !isLargeScreen;

  return (
    <>
      {/* Small Header - slides down from top when needed */}
      <header
        className={cn(
          "fixed top-0 z-50 w-full dark:bg-black bg-white border flex items-center justify-between py-4 px-6 gap-4 transition-transform duration-300",
          showSmallHeader ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <Sidebar />

        <div
          className={cn(
            "flex items-center justify-center flex-col gap-1 transition-all",
            shouldShowLogo ? "" : "lg:opacity-0"
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
                theme === "dark" ? "mb-0" : "lg:mb-2"
              )}
            />
          </Link>

          <p
            className={cn(
              "text-xs text-muted-foreground hidden sm:block",
              domine.className
            )}
          >
            The University Daily, Est. 2025
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      {/* Large Header - main header section */}
      <div
        ref={largeHeaderRef}
        className="w-full dark:bg-black bg-white border-b hidden lg:block"
      >
        {/* Top section with date, logo, and buttons */}
        <div className="w-full max-w-7xl mx-auto px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            {/* Left: Date and Weather */}
            <div className="flex flex-col gap-1.5">
              <p className="whitespace-nowrap text-sm font-medium">{date}</p>

              {weather.temp !== 0 && (
                <p className="whitespace-nowrap text-sm font-medium">
                  {Math.floor(weather.temp)} °C | {weather.condition}
                </p>
              )}

              <Sidebar />
            </div>

            {/* Center: Large Logo */}
            <div className="flex items-center justify-center flex-col gap-1">
              <Link href={PAGES.home}>
                <Image
                  src={logo.src}
                  alt="The Babcock Torch"
                  width={logo.width}
                  height={logo.height}
                  className={cn(
                    "w-96 h-auto",
                    theme === "dark" ? "mb-0" : "mb-3"
                  )}
                />
              </Link>
              <p className={cn("text-sm", domine.className)}>
                The University Daily, Est. 2025
              </p>
            </div>

            {/* Right: Talk to the Torch and Theme Toggle */}
            <div className="flex flex-col items-end gap-3">
              <IdeaSubmission />
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="w-full border-t border-b">
          <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-center">
            {MAJOR_CATEGORIES.map((category, i) => (
              <Link href={category.href} key={i}>
                <div
                  className={cn(
                    "px-4 py-3 text-sm font-medium border-b-2 border-transparent hover:border-primary transition-colors cursor-pointer",
                    pathname === category.href
                      ? "border-primary font-semibold"
                      : ""
                  )}
                >
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </nav>

        <div className="w-full bg-muted/30 border-t">
          <div className="w-full max-w-6xl mx-auto px-6 py-4 grid grid-cols-3 gap-6">
            <Link
              href="https://www.youtube.com/@babcocktorch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <FaYoutube className="w-10 h-10 text-gold" />

              <span className="font-medium">Subscribe to The Torch</span>
            </Link>

            <Link
              href={PAGES.home}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Image
                src={IMAGES.creatives.src}
                alt="Babcock Creatives"
                width={IMAGES.creatives.width}
                height={IMAGES.creatives.height}
                className="w-8 h-8 text-gold"
              />

              <span className="font-medium">See Babcock&apos;s Creatives</span>
            </Link>

            <Link
              href={PAGES.communities}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Users className="w-9 h-9 text-gold" />

              <span className="font-medium">View Communities at Babcock</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump when small header is fixed */}
      <div
        className={cn(
          "transition-all duration-300",
          showSmallHeader ? "h-[72px]" : "h-0"
        )}
      />
    </>
  );
};

export default Header;
