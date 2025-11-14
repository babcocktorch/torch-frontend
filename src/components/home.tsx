"use client";

import Article from "@/components/article";
import { Separator } from "@/components/ui/separator";
import { app_theme, is_categories_at_viewport_edge } from "@/lib/atoms";
import {
  MAJOR_CATEGORIES,
  MINOR_CATEGORIES,
  IMAGES,
  PAGES,
} from "@/lib/constants";
import { domine } from "@/lib/fonts";
import { useAtomValue, useSetAtom } from "jotai";
import Image from "next/image";
import { useRef, useEffect, useState, Fragment } from "react";
import { OpinionPreview, PostPreview } from "@/lib/types";
import { IoIosArrowForward } from "react-icons/io";
import IdeaSubmission from "./general/idea-submission";
import Opinion from "./opinion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Home = ({
  posts,
  weather,
  opinions,
}: {
  posts: PostPreview[];
  weather: { temp: number; condition: string };
  opinions: OpinionPreview[];
}) => {
  const pathname = usePathname();
  const theme = useAtomValue(app_theme);
  const setIsCategoriesAtViewportEdge = useSetAtom(
    is_categories_at_viewport_edge
  );

  const [isBelowThreshold, setIsBelowThreshold] = useState(false);
  const categoriesRef = useRef<HTMLDivElement | null>(null);

  const THRESHOLD = 640;

  const logo =
    theme === "dark"
      ? IMAGES.logos.engravers_old_eng_white
      : IMAGES.logos.big_moore_gold;
  // : IMAGES.logos.engravers_old_eng_black;

  const categories = isBelowThreshold ? MINOR_CATEGORIES : MAJOR_CATEGORIES;

  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  useEffect(() => {
    if (!categoriesRef.current) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsCategoriesAtViewportEdge(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px",
      }
    );

    observer.observe(categoriesRef.current);

    return () => {
      if (categoriesRef.current) observer.unobserve(categoriesRef.current);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsBelowThreshold(width < THRESHOLD);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [THRESHOLD]);

  return (
    <main className="w-full max-w-7xl flex flex-col items-center justify-start lg:pt-12 pb-12 gap-6 px-6">
      <div className="w-full hidden lg:flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <p className="whitespace-nowrap text-sm">{date}</p>
          {weather.temp !== 0 && (
            <p className="whitespace-nowrap text-sm">
              {Math.floor(weather.temp)} °C | {weather.condition}
            </p>
          )}
        </div>

        <div className="w-full items-center justify-center flex flex-col gap-1">
          <Image
            src={logo.src}
            alt="The Babcock Torch"
            width={logo.width}
            height={logo.height}
            className={cn("w-96 h-auto", theme === "dark" ? "mb-0" : "mb-3")}
          />

          <p className={domine.className}>The University Daily, Est. 2025</p>
        </div>

        <IdeaSubmission />
      </div>

      <div
        ref={categoriesRef}
        className="border-b w-full px-4 pt-2 flex items-center justify-start lg:justify-center overflow-x-scroll"
      >
        {categories.map((c, i) => (
          <Link href={c.href} key={i}>
            <p
              className={cn(
                "dark:text-white text-black text-sm lg:text-base font-medium bg-transparent px-4 py-2 border-b border-transparent hover:border-primary cursor-pointer whitespace-nowrap",
                pathname === c.href ? "border-primary" : ""
              )}
            >
              {c.name}
            </p>
          </Link>
        ))}
      </div>

      <section className="w-full flex flex-col lg:flex-row items-center justify-center">
        <div className="w-full lg:w-3/4 flex flex-col gap-6 lg:border-r lg:pr-6 self-stretch">
          {posts.map((post) => (
            <Fragment key={post._id}>
              <Article post={post} />
              <Separator />
            </Fragment>
          ))}
        </div>

        <div className="w-full lg:w-1/4 self-stretch lg:pl-6 flex flex-col gap-6 mt-6 lg:mt-0">
          <h6 className="flex items-center justify-start gap-1 font-medium hover:gap-1.5 cursor-pointer transition-all">
            <Link href={PAGES.opinions} className="border-b-2 border-gold">
              Opinions
            </Link>{" "}
            <IoIosArrowForward />
          </h6>

          {opinions.map((opinion) => (
            <Opinion key={opinion._id} opinion={opinion} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
