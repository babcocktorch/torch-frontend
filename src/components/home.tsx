"use client";

import Article from "@/components/article";
import { Separator } from "@/components/ui/separator";
import { IMAGES, PAGES } from "@/lib/constants";
import { Fragment } from "react";
import { PostType } from "@/lib/types";
import { IoIosArrowForward } from "react-icons/io";
import Opinion from "./opinion";
import Link from "next/link";
import MostRead from "./general/most-read";
import CompressedArticle from "./general/compressed-article";
import ContributorCTA from "./general/contributor-cta";
import EditorsPick from "./general/editors-pick";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import { cn } from "@/lib/utils";
import { domine } from "@/lib/fonts";

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
  // - More Top Stories: remaining posts (compressed)
  const additionalArticles = otherNewsPosts.slice(0, 2);
  const moreTopStories = otherNewsPosts.slice(2, 8);
  const moreTopStoriesWithImage = moreTopStories[0];
  const moreTopStoriesCompressed = moreTopStories.slice(1);

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

      {/* More Top Stories + Most Read Section */}
      {moreTopStories.length > 0 && (
        <section className="w-full flex flex-col lg:flex-row gap-6">
          {/* More Top Stories */}
          <div className="w-full lg:w-3/4 lg:border-r lg:pr-6">
            <h6 className="flex items-center justify-start gap-1 font-medium mb-6 hover:gap-1.5 cursor-pointer transition-all">
              <span className="border-b-2 border-gold">More Top Stories</span>
            </h6>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Featured Story with Image */}
              {moreTopStoriesWithImage && (
                <div className="w-full md:w-2/5">
                  <MoreTopStoriesFeature post={moreTopStoriesWithImage} />
                </div>
              )}

              {/* Compressed List */}
              <div className="w-full md:w-3/5">
                {moreTopStoriesCompressed.map((post) => (
                  <CompressedArticle key={post._id} post={post} />
                ))}
              </div>
            </div>
          </div>

          {/* Most Read Sidebar */}
          <div className="w-full lg:w-1/4">
            <MostRead posts={newsPosts} limit={5} />
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

// Sub-component for More Top Stories featured article
const MoreTopStoriesFeature = ({ post }: { post: PostType }) => {
  const postUrl = post.slug === "#" ? "#" : PAGES.post(post.slug);

  return (
    <Link href={postUrl} className="group block">
      {post.mainImage ? (
        <Image
          src={urlFor(post.mainImage).width(400).height(300).fit("crop").url()}
          alt={post.title}
          width={400}
          height={300}
          className="w-full h-auto object-cover mb-4"
        />
      ) : (
        <div className="w-full aspect-4/3 bg-linear-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4">
          <div className="text-gold/40 text-4xl font-miller">T</div>
        </div>
      )}
      <h3
        className={cn(
          "text-base lg:text-lg font-medium group-hover:text-gold transition-colors",
          domine.className,
        )}
      >
        {post.title}
      </h3>
    </Link>
  );
};

export default Home;
