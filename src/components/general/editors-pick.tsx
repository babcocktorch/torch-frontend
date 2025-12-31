import { cn, getDayMonthYear, formatDate } from "@/lib/utils";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import Link from "next/link";
import { PostType } from "@/lib/types";
import { PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";

interface EditorsPickProps {
  featuredPost: PostType;
  secondaryHeadlines: PostType[];
}

const EditorsPick = ({ featuredPost, secondaryHeadlines }: EditorsPickProps) => {
  const { day, month, year } = getDayMonthYear(featuredPost.date);
  const postUrl = featuredPost.slug === "#" ? "#" : PAGES.post(year, month, day, featuredPost.slug);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Featured Article Text + Secondary Headlines */}
      <div className="w-full lg:w-2/5 flex flex-col">
        {/* Editor's Pick Label */}
        <span className="text-gold text-xs font-semibold tracking-wider uppercase mb-3">
          Editors Pick
        </span>

        {/* Featured Article */}
        <Link href={postUrl} className="group">
          <h2
            className={cn(
              "text-2xl lg:text-3xl font-semibold mb-3 group-hover:text-gold transition-colors",
              "font-miller"
            )}
          >
            {featuredPost.title}
          </h2>
          <p className="text-muted-foreground mb-3 text-sm lg:text-base">
            {featuredPost.description}
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            By{" "}
            <span className="font-medium text-foreground">
              {featuredPost.author.name}
            </span>{" "}
            • {formatDate(featuredPost.date)}
          </p>
        </Link>

        {/* Secondary Headlines */}
        <div className="flex flex-col gap-3 border-t pt-4">
          {secondaryHeadlines.map((post) => {
            const { day, month, year } = getDayMonthYear(post.date);
            const url = post.slug === "#" ? "#" : PAGES.post(year, month, day, post.slug);

            return (
              <Link key={post._id} href={url} className="group">
                <h3
                  className={cn(
                    "text-base font-medium group-hover:text-gold transition-colors",
                    domine.className
                  )}
                >
                  {post.title}
                </h3>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Right: Featured Image */}
      <div className="w-full lg:w-3/5">
        <Link href={postUrl}>
          {featuredPost.mainImage ? (
            <Image
              src={urlFor(featuredPost.mainImage)
                .width(800)
                .height(600)
                .fit("crop")
                .url()}
              alt={featuredPost.title}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          ) : (
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <div className="text-gold/40 text-6xl font-miller">T</div>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default EditorsPick;

