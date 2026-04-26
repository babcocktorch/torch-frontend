import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";
import { NextResponse } from "next/server";
import { PAGES, BASE_URL } from "@/lib/constants";
import {
  getPosts,
  getOpinions,
  getCommunities,
  getAllAuthors,
  getImpactStories,
} from "@/lib/requests";

// ISR: regenerate every hour
export const revalidate = 3600;

/**
 * Priority and change frequency overrides for known static pages.
 * Pages not listed here get the default (0.5, monthly).
 */
const STATIC_PAGE_CONFIG: Record<
  string,
  { priority: number; changefreq: string }
> = {
  "/": { priority: 1.0, changefreq: "daily" },
  "/top-stories": { priority: 0.9, changefreq: "daily" },
  "/opinions": { priority: 0.9, changefreq: "daily" },
  "/communities": { priority: 0.7, changefreq: "weekly" },
  "/streaming": { priority: 0.7, changefreq: "weekly" },
  "/gallery": { priority: 0.7, changefreq: "weekly" },
  "/masthead": { priority: 0.5, changefreq: "monthly" },
  "/policy": { priority: 0.5, changefreq: "monthly" },
  "/ask-the-torch-ai": { priority: 0.5, changefreq: "monthly" },
  "/search": { priority: 0.5, changefreq: "monthly" },
};

/** Pages to explicitly exclude from the sitemap */
const EXCLUDED_PAGES = new Set(["/business", "/vendors", "/alumni"]);

/**
 * Extracts all static page paths from the PAGES constant.
 * Only includes direct string values (not function-type dynamic routes).
 * Automatically adapts when you add/remove entries from PAGES.
 */
function getStaticPages(): { url: string; changefreq: string; priority: number }[] {
  const pages: { url: string; changefreq: string; priority: number }[] = [];

  for (const value of Object.values(PAGES)) {
    if (typeof value === "string" && !EXCLUDED_PAGES.has(value)) {
      const config = STATIC_PAGE_CONFIG[value] || {
        priority: 0.5,
        changefreq: "monthly",
      };
      pages.push({
        url: value,
        changefreq: config.changefreq,
        priority: config.priority,
      });
    }
  }

  return pages;
}

export const GET = async () => {
  // Fetch all dynamic content in parallel
  const [
    { posts },
    { opinions },
    communitiesResult,
    authors,
    impactStories,
  ] = await Promise.all([
    getPosts(),
    getOpinions(),
    getCommunities(),
    getAllAuthors(),
    getImpactStories(),
  ]);

  const communities = communitiesResult.data || [];

  // Build static page links
  const staticLinks = getStaticPages();

  // Build article links (de-duplicated by slug)
  const articleSlugs = new Set<string>();
  const articleLinks: { url: string; changefreq: string; priority: number }[] = [];

  for (const post of posts) {
    if (!articleSlugs.has(post.slug)) {
      articleSlugs.add(post.slug);
      articleLinks.push({
        url: `/p/${post.slug}`,
        changefreq: "weekly",
        priority: 0.8,
      });
    }
  }

  // Add opinions (de-duplicate with articles since they share /p/{slug})
  for (const opinion of opinions) {
    if (!articleSlugs.has(opinion.slug)) {
      articleSlugs.add(opinion.slug);
      articleLinks.push({
        url: `/p/${opinion.slug}`,
        changefreq: "weekly",
        priority: 0.8,
      });
    }
  }

  // Build community links
  const communityLinks = communities.map((community) => ({
    url: `/communities/${community.slug}`,
    changefreq: "weekly",
    priority: 0.6,
  }));

  // Build author links (only authors with slugs)
  const authorLinks = authors
    .filter((author) => author.slug)
    .map((author) => ({
      url: `/author/${author.slug}`,
      changefreq: "monthly",
      priority: 0.6,
    }));

  // Build impact story links
  const impactStoryLinks = impactStories.map((story) => ({
    url: `/communities/stories/${story.slug}`,
    changefreq: "weekly",
    priority: 0.6,
  }));

  // Combine all links
  const links = [
    ...staticLinks,
    ...articleLinks,
    ...communityLinks,
    ...authorLinks,
    ...impactStoryLinks,
  ];

  const stream = new SitemapStream({
    hostname: BASE_URL,
    xmlns: {
      news: false,
      xhtml: false,
      image: false,
      video: false,
    },
  });

  const sitemap = await streamToPromise(
    Readable.from(links).pipe(stream),
  ).then((data) => data.toString());

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
};
