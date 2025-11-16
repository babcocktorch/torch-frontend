"use client";

import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";
import { searchPosts } from "@/lib/requests";
import { PostType } from "@/lib/types";
import { cn, formatDate, getDayMonthYear } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTerm = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(queryTerm);
  const [results, setResults] = useState<PostType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const posts = results.filter((post) => post.isPost);
  const opinions = results.filter((post) => !post.isPost);
  const hasSearched = queryTerm.trim().length > 0;

  const performSearch = async (term: string) => {
    setIsSearching(true);
    try {
      const searchResults = await searchPosts(term);
      setResults(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    setInputValue(queryTerm);
  }, [queryTerm]);

  useEffect(() => {
    if (queryTerm.trim()) {
      performSearch(queryTerm);
    } else {
      setResults([]);
    }
  }, [queryTerm]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (inputValue !== queryTerm) {
        if (inputValue.trim()) {
          router.push(`/search?q=${encodeURIComponent(inputValue)}`);
        } else {
          router.push("/search");
        }
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [inputValue, queryTerm, router]);

  return (
    <main className="max-w-4xl mx-auto px-6 my-8 w-full min-h-screen">
      <div className="relative mb-12">
        <Input
          placeholder="Search for articles and opinions..."
          className="h-auto p-4 rounded-none pr-12"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <IoSearchOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl" />
      </div>

      {!hasSearched && (
        <p className="font-miller text-2xl md:text-3xl lg:text-4xl font-medium w-full text-center text-muted-foreground">
          Enter a search term to get started
        </p>
      )}

      {isSearching && (
        <p className="font-miller text-xl md:text-2xl font-medium w-full text-center text-muted-foreground">
          Searching...
        </p>
      )}

      {hasSearched && !isSearching && results.length === 0 && (
        <p className="font-miller text-xl md:text-2xl font-medium w-full text-center text-muted-foreground">
          No results found for &ldquo;{queryTerm}&rdquo;
        </p>
      )}

      {hasSearched && !isSearching && results.length > 0 && (
        <div className="flex flex-col gap-8">
          <p className="text-muted-foreground">
            Found {results.length} result{results.length !== 1 ? "s" : ""} for
            &ldquo;{queryTerm}&rdquo;
          </p>

          {posts.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold font-miller">
                Articles
              </h2>

              <div className="grid grid-cols-1 gap-8">
                {posts.map((post) => {
                  const { day, month, year } = getDayMonthYear(post.date);
                  const postUrl = PAGES.post(year, month, day, post.slug);

                  return (
                    <React.Fragment key={post._id}>
                      <Link href={postUrl}>
                        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 cursor-pointer group">
                          <div className="flex flex-row items-start gap-6 w-full">
                            <p className="text-sm text-muted-foreground whitespace-nowrap pt-1">
                              {formatDate(post.date)}
                            </p>

                            <div className="flex flex-col gap-2">
                              <p
                                className={cn(
                                  domine.className,
                                  "sm:text-lg lg:text-xl font-semibold group-hover:text-primary transition-colors"
                                )}
                              >
                                {post.title}
                              </p>
                              <p className="text-muted-foreground">
                                {post.description}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                By{" "}
                                <span className="font-primary font-medium">
                                  {post.author.name}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Separator />
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {opinions.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold font-miller">
                Opinions
              </h2>

              <div className="grid grid-cols-1 gap-8">
                {opinions.map((opinion) => {
                  const { day, month, year } = getDayMonthYear(opinion.date);
                  const opinionUrl = PAGES.post(year, month, day, opinion.slug);

                  return (
                    <React.Fragment key={opinion._id}>
                      <Link href={opinionUrl}>
                        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 cursor-pointer group">
                          <div className="flex flex-row items-start gap-6 w-full">
                            <p className="text-sm text-muted-foreground whitespace-nowrap pt-1">
                              {formatDate(opinion.date)}
                            </p>

                            <div className="flex flex-col gap-2">
                              <p
                                className={cn(
                                  domine.className,
                                  "sm:text-lg lg:text-xl font-semibold group-hover:text-primary transition-colors"
                                )}
                              >
                                {opinion.title}
                              </p>
                              <p className="text-muted-foreground">
                                {opinion.description}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                By{" "}
                                <span className="font-primary font-medium">
                                  {opinion.author.name}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Separator />
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

const SearchPage = () => {
  return (
    <Suspense
      fallback={
        <main className="max-w-4xl mx-auto px-6 my-8 w-full min-h-screen">
          <div className="relative mb-12">
            <Input
              placeholder="Search for articles and opinions..."
              className="h-auto p-4 rounded-none pr-12"
              disabled
            />
            <IoSearchOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xl" />
          </div>
          <p className="font-miller text-2xl md:text-3xl lg:text-4xl font-medium w-full text-center text-muted-foreground">
            Enter a search term to get started
          </p>
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
