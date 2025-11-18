"use client";

import Article from "@/components/article";
import { Separator } from "@/components/ui/separator";
import { PAGES } from "@/lib/constants";
import { Fragment } from "react";
import { PostType } from "@/lib/types";
import { IoIosArrowForward } from "react-icons/io";
import Opinion from "./opinion";
import Link from "next/link";

const Home = ({ posts }: { posts: PostType[] }) => {
  return (
    <main className="w-full max-w-7xl flex flex-col items-center justify-start py-8 gap-6 px-6">
      <section className="w-full flex flex-col lg:flex-row items-center justify-center">
        <div className="w-full lg:w-3/4 flex flex-col gap-6 lg:border-r lg:pr-6 self-stretch">
          {posts
            .filter((post) => post.isPost)
            .map((post) => (
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

          {posts
            .filter((post) => !post.isPost)
            .map((post) => (
              <Opinion key={post._id} post={post} />
            ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
