"use client";

import Article from "@/components/article";
import { Separator } from "@/components/ui/separator";
import { IMAGES, PAGES } from "@/lib/constants";
import { Fragment } from "react";
import { PostType } from "@/lib/types";
import { IoIosArrowForward } from "react-icons/io";
import Opinion from "./opinion";
import Link from "next/link";
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

  return (
    <main className="w-full max-w-7xl flex flex-col items-center justify-start py-8 gap-8 px-6">
      {/* Two-Column Layout: Articles + Opinions */}
      <section className="w-full flex flex-col lg:flex-row gap-6">
        {/* Left: Editor's Pick + All Remaining Articles */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 lg:border-r lg:pr-6">
          {/* Editor's Picks */}
          {primaryPick && (
            <EditorsPick
              featuredPost={primaryPick}
              secondaryPicks={secondaryPicks}
            />
          )}

          <Separator />

          {/* All remaining news articles */}
          {otherNewsPosts.map((post, index) => (
            <Fragment key={post._id}>
              <Article post={post} />
              {index < otherNewsPosts.length - 1 && <Separator />}
            </Fragment>
          ))}
        </div>

        {/* Right: Opinions Sidebar (sticky) */}
        <div className="w-full lg:w-1/4">
          <div className="lg:sticky lg:top-32.5 flex flex-col gap-4">
            <h6 className="flex items-center justify-start gap-1 font-medium hover:gap-1.5 cursor-pointer transition-all">
              <Link href={PAGES.opinions} className="border-b-2 border-gold">
                Opinions
              </Link>{" "}
              <IoIosArrowForward />
            </h6>

            {opinions.slice(0, 10).map((post) => (
              <Opinion key={post._id} post={post} />
            ))}
          </div>
        </div>
      </section>

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
