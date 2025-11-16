import { PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";
import { getPosts } from "@/lib/requests";
import { urlFor } from "@/lib/sanity.client";
import { cn, getDayMonthYear } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const FeaturedPosts = async ({ slug }: { slug: string }) => {
  const posts = await getPosts();

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) =>
        post.featured === true &&
        post.isPublished === true &&
        post.slug !== slug ? (
          <article key={post._id} className="flex lg:flex-row flex-col">
            <Link
              href={PAGES.post(
                getDayMonthYear(post.date).year,
                getDayMonthYear(post.date).month,
                getDayMonthYear(post.date).day,
                post.slug
              )}
              className="flex flex-col gap-4 p-3 rounded-lg border"
            >
              <Image
                src={urlFor(post.mainImage)
                  .width(400)
                  .fit("max")
                  .auto("format")
                  .url()}
                width={400}
                height={230}
                alt={post.mainImage.alt || "Post Image"}
                loading="lazy"
                className="w-full h-auto rounded-sm"
              />
              <div className="max-w-lg">
                <h2
                  className={cn("text-lg font-medium mb-4", domine.className)}
                >
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {post.description.slice(0, 80).padEnd(83, "...")}
                </p>
              </div>
            </Link>
          </article>
        ) : null
      )}
    </div>
  );
};

export default FeaturedPosts;
