"use client";

import Article from "@/components/article";
import { Separator } from "@/components/ui/separator";
import { app_theme, is_categories_at_viewport_edge } from "@/lib/atoms";
import { MAJOR_CATEGORIES, MINOR_CATEGORIES, IMAGES } from "@/lib/constants";
import { playfair } from "@/lib/fonts";
import { useAtomValue, useSetAtom } from "jotai";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { sanityClient } from "@/lib/sanity.client";
import { groq } from "next-sanity";
import { PostPreview } from "@/lib/types";

const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    description,
    publishedAt,
    author->{
      name
    }
  }
`;

const Home = () => {
  const theme = useAtomValue(app_theme);
  const setIsCategoriesAtViewportEdge = useSetAtom(
    is_categories_at_viewport_edge
  );

  const [isBelowThreshold, setIsBelowThreshold] = useState(false);
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const categoriesRef = useRef<HTMLDivElement | null>(null);

  const THRESHOLD = 640;

  const logo =
    theme === "dark"
      ? IMAGES.logos.engravers_old_eng_white
      : IMAGES.logos.engravers_old_eng_gold;

  const categories = isBelowThreshold ? MINOR_CATEGORIES : MAJOR_CATEGORIES;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await sanityClient.fetch(postsQuery);
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

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
      <div className="w-full items-center justify-center flex-col hidden lg:flex gap-1">
        <Image
          src={logo.src}
          alt="The Babcock Torch"
          width={logo.width}
          height={logo.height}
          className="w-96 h-auto"
        />

        <p className={playfair.className}>The University Daily, Est. 2025</p>
      </div>

      <div
        ref={categoriesRef}
        className="border-b border-muted w-full px-4 py-2 flex items-center justify-start lg:justify-center overflow-x-scroll"
      >
        {categories.map((c, i) => (
          <div
            key={i}
            className="dark:text-white text-black text-sm font-medium bg-transparent rounded-full px-4 py-2 hover:bg-muted cursor-pointer whitespace-nowrap"
          >
            {c}
          </div>
        ))}
      </div>

      <section className="w-full flex flex-col lg:flex-row items-center justify-center">
        <div className="w-full lg:w-4/5 flex flex-col gap-6 lg:border-r lg:pr-6 self-stretch">
          {posts.length > 0 ? (
            posts.map((post) => <Article key={post._id} post={post} />)
          ) : (
            <p>Loading articles...</p>
          )}
          <Separator />
        </div>

        <div className="w-full lg:w-1/5 self-stretch"></div>
      </section>
    </main>
  );
};

export default Home;
