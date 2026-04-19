"use client";

import { app_theme } from "@/lib/atoms";
import { IMAGES, PAGES, MAJOR_CATEGORIES } from "@/lib/constants";
import { useAtomValue } from "jotai";
import Image from "next/image";
import ThemeToggle from "./general/theme-toggle";
import Sidebar from "./general/sidebar";
import { cn } from "@/lib/utils";
import { georgia } from "@/lib/fonts";
import Link from "next/link";
import IdeaSubmission from "./general/idea-submission";
import { useEffect, useRef, useState } from "react";
import { FaYoutube } from "react-icons/fa";
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

  // const logo =
  //   theme === "dark"
  //     ? IMAGES.logos.qt_fraktur_white
  //     : IMAGES.logos.big_moore_gold;

  const logo =
    theme === "dark" ? IMAGES.logos.osgard_white : IMAGES.logos.osgard_gold;

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
      },
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
          "fixed top-0 z-50 w-full dark:bg-black bg-white border flex flex-col transition-transform duration-300",
          showSmallHeader ? "translate-y-0" : "-translate-y-full",
        )}
      >
        {/* <div className="p-4 w-full flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex flex-col gap-1.5 left-0">
            <p className="whitespace-nowrap text-xs font-medium">{date}</p>

            {weather.temp !== 0 && (
              <p className="whitespace-nowrap text-xs font-medium">
                {Math.floor(weather.temp)} °C |{" "}
                {weather.condition.split(" ").slice(0, 2).join(" ")}
              </p>
            )}
          </div>

          <IdeaSubmission />
        </div> */}

        {/* Top row: Sidebar, Logo, Theme Toggle */}
        <div className="flex items-center justify-between p-4 gap-4 max-w-7xl mx-auto w-full border-t">
          <Sidebar />

          <div
            className={cn(
              "flex items-center justify-center flex-col gap-1 transition-all",
              shouldShowLogo ? "" : "lg:opacity-0",
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
                  // theme === "dark" ? "mb-0" : "lg:mb-2",
                )}
              />
            </Link>

            <p
              className={cn(
                "text-xs text-muted-foreground hidden sm:block",
                georgia.className,
              )}
            >
              The University Daily, Est. 2025
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="w-full border-t overflow-x-auto scrollbar-hide flex whitespace-nowrap">
          <div className="flex items-center justify-start md:justify-center px-2 py-0.5 flex-1 min-w-max">
            {MAJOR_CATEGORIES.map((category, i) => (
              <Link href={category.href} key={i}>
                <div
                  className={cn(
                    "px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium border-b-2 border-transparent hover:border-primary transition-colors cursor-pointer",
                    pathname === category.href
                      ? "border-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Large Header - main header section */}
      <div
        ref={largeHeaderRef}
        className="w-full dark:bg-black bg-white border-b hidden lg:block"
      >
        {/* Top section with date, logo, and buttons */}
        <div className="w-full max-w-7xl mx-auto px-6 pt-6 pb-4">
          <div className="flex items-center justify-center relative">
            {/* Left: Date and Weather */}
            <div className="flex flex-col gap-1.5 absolute left-0">
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
                    // theme === "dark" ? "mb-0" : "mb-3",
                  )}
                />
              </Link>
              <p className={cn("text-sm", georgia.className)}>
                The University Daily, Est. 2025
              </p>
            </div>

            {/* Right: Talk to the Torch and Theme Toggle */}
            <div className="flex flex-col items-end gap-3 absolute right-0">
              <IdeaSubmission />
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="w-full">
          <div className="w-full border-b max-w-7xl mx-auto px-6 flex items-center justify-center">
            {MAJOR_CATEGORIES.map((category, i) => (
              <Link href={category.href} key={i}>
                <div
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-primary transition-colors cursor-pointer",
                    pathname === category.href
                      ? "border-primary font-semibold"
                      : "",
                  )}
                >
                  {category.name}
                </div>
              </Link>
            ))}
          </div>
        </nav>

        {pathname === PAGES.home && (
          <div className="w-full border-t">
            <div className="w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-evenly gap-8">
              <Link
                href="https://www.youtube.com/@babcocktorch"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <FaYoutube className="w-7 h-auto text-gold dark:text-white" />
                <span className="font-medium text-sm">
                  Subscribe to The Torch
                </span>
              </Link>

              <IdeaSubmission
                trigger={
                  <button className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                    <svg
                      className="w-6 h-auto text-gold dark:text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L12 22M2 12L22 12"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="font-medium text-sm">Submit a Story</span>
                  </button>
                }
              />

              <Link
                href={PAGES.communities}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <svg
                  className="w-6 h-auto text-gold dark:text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-medium text-sm">
                  View Communities at Babcock
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Spacer to push content down below the fixed small header on mobile/tablet */}
      <div className="h-[90px] sm:h-[120px] lg:hidden" />
    </>
  );
};

export default Header;
