"use client";

import Article from "@/components/article";
import { Separator } from "@/components/ui/separator";
import { IMAGES, PAGES } from "@/lib/constants";
import { Fragment } from "react";
import { PostType } from "@/lib/types";
import { IoIosArrowForward } from "react-icons/io";
import Opinion from "./opinion";
import Link from "next/link";
import { TopStoryCard } from "./general/top-story-card";
import { ImpactStoryCard } from "./general/impact-story-card";
import ContributorCTA from "./general/contributor-cta";
import EditorsPick from "./general/editors-pick";

type HomeProps = {
  posts: PostType[];
  editorsPickSlugs: string[];
};

const Home = ({ posts, editorsPickSlugs }: HomeProps) => {
  // Separate news posts and opinions
  const newsPosts = posts.filter((post) => post.isPost);
  const opinions = posts.filter((post) => !post.isPost);

  // Find editor's picks from backend (slugs are already sorted newest-first)
  // Fall back to first post if no picks are set
  const editorsPickPosts: PostType[] =
    editorsPickSlugs.length > 0
      ? editorsPickSlugs
          .map((slug) => newsPosts.find((post) => post.slug === slug))
          .filter((post): post is PostType => !!post)
      : newsPosts.slice(0, 1);

  // Primary pick is the first (newest), secondary picks are the rest
  const primaryPick = editorsPickPosts[0];
  const secondaryPicks = editorsPickPosts.slice(1);

  // Get other posts (excluding all editor's picks)
  const pickSlugs = new Set(editorsPickPosts.map((p) => p.slug));
  const otherNewsPosts = newsPosts.filter((post) => !pickSlugs.has(post.slug));

  // Layout distribution:
  // - Editor's Picks: 1 primary + up to 2 secondary (from backend)
  // - Additional articles with images: 2 posts
  // - More Top Stories: 8 posts
  // - Impact Stories: 4 posts
  const additionalArticles = otherNewsPosts.slice(0, 2);
  const moreTopStories = otherNewsPosts.slice(2, 10);
  const impactStories = otherNewsPosts.slice(10, 14);

  return (
    <main className="w-full max-w-7xl flex flex-col items-center justify-start py-8 gap-8 px-6">
      {/* Hero Section: Editor's Pick + Opinions */}
      <section className="w-full flex flex-col lg:flex-row gap-6">
        {/* Left: Editor's Pick + Additional Articles */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 lg:border-r lg:pr-6">
          {/* Editor's Picks */}
          {primaryPick && (
            <EditorsPick
              featuredPost={primaryPick}
              secondaryPicks={secondaryPicks}
            />
          )}

          <Separator />

          {/* Additional Articles with Images */}
          {additionalArticles.map((post, index) => (
            <Fragment key={post._id}>
              <Article post={post} />
              {index < additionalArticles.length - 1 && <Separator />}
            </Fragment>
          ))}
        </div>

        {/* Right: Opinions Sidebar */}
        <div className="w-full lg:w-1/4 flex flex-col gap-4">
          <h6 className="flex items-center justify-start gap-1 font-medium hover:gap-1.5 cursor-pointer transition-all">
            <Link href={PAGES.opinions} className="border-b-2 border-gold">
              Opinions
            </Link>{" "}
            <IoIosArrowForward />
          </h6>

          {opinions.slice(0, 8).map((post) => (
            <Opinion key={post._id} post={post} />
          ))}
        </div>
      </section>

      {/* More Top Stories Section */}
      {moreTopStories.length > 0 && (
        <section className="w-full">
          <div className="border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between mb-8 pb-1">
            <Link
              href={PAGES.top_stories}
              className="flex items-center justify-start gap-1 font-semibold hover:gap-1.5 cursor-pointer transition-all border-b-2 border-gold pb-1 md:pb-2 -mb-[2px] md:-mb-[5px]"
            >
              <span className="text-sm lg:text-base">More Top Stories</span>
              <IoIosArrowForward className="text-muted-foreground ml-1 text-sm" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {moreTopStories.map((post) => (
              <TopStoryCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Impact Stories Section */}
      {impactStories.length > 0 && (
        <section className="w-full">
          <div className="border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between mb-8 pb-1">
            <h6 className="flex items-center justify-start gap-1 font-semibold hover:gap-1.5 cursor-pointer transition-all border-b-2 border-gold pb-1 md:pb-2 -mb-[2px] md:-mb-[5px]">
              <span className="text-sm lg:text-base">Impact Stories</span>
              <IoIosArrowForward className="text-muted-foreground ml-1 text-sm" />
            </h6>
          </div>

          {/* Uses border-r for items on larger screens to match visual lines */}
          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row items-stretch justify-between gap-y-8 lg:gap-0 lg:divide-x divide-border/50">
            {impactStories.map((post) => (
              <div
                key={post._id}
                className="w-full lg:flex-1 lg:px-4 first:lg:pl-0 last:lg:pr-0"
              >
                <ImpactStoryCard post={post} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <ContributorCTA
        className="my-4"
        buttonText="Contribute Now"
        lineOne="Your Voice,"
        lineTwo="Your Platform."
        description="The Torch is built for student contributors. Pitch a story idea, submit an opinion piece, or report on campus news."
        bgImage={IMAGES.contributor_cta.src}
      />
    </main>
  );
};

export default Home;
