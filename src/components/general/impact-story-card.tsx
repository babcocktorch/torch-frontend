import { formatDate } from "@/lib/utils";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import Link from "next/link";
import { PostType } from "@/lib/types";
import { PAGES } from "@/lib/constants";

export const ImpactStoryCard = ({ post }: { post: PostType }) => {
  const postUrl = post.slug === "#" ? "#" : PAGES.post(post.slug);
  const categoryLabel = post.categories?.[0]?.title || "News";
  const authorName = post.author?.name || "The Torch";

  return (
    <Link
      href={postUrl}
      className="group flex flex-col h-full lg:border-r lg:border-border/50 lg:pr-6 lg:last:border-r-0 lg:last:pr-0"
    >
      {/* Image */}
      <div className="relative w-full aspect-16/10 overflow-hidden bg-muted mb-4">
        {post.mainImage ? (
          <Image
            src={urlFor(post.mainImage)
              .width(400)
              .height(250)
              .fit("crop")
              .url()}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gold/20 to-gold/5 flex items-center justify-center">
            <span className="text-gold/40 text-4xl font-miller">T</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <span className="text-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest block mb-2">
          {categoryLabel}
        </span>
        <h3 className="text-base lg:text-lg font-medium group-hover:text-gold transition-colors leading-snug mb-3 font-miller">
          {post.title}
        </h3>

        {/* Footer */}
        <div className="mt-auto text-[11px] text-muted-foreground font-medium uppercase tracking-wide pt-2 border-t border-border/30">
          <span className="text-foreground font-bold">{authorName}</span>
          <span className="mx-1.5 opacity-50">•</span>
          <span>{formatDate(post.date)}</span>
        </div>
      </div>
    </Link>
  );
};
