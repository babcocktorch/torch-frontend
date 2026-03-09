import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import Link from "next/link";
import { PostType } from "@/lib/types";
import { PAGES } from "@/lib/constants";

export const TopStoryCard = ({ post }: { post: PostType }) => {
  const postUrl = post.slug === "#" ? "#" : PAGES.post(post.slug);
  const categoryLabel = post.categories?.[0]?.title || "News";

  return (
    <Link href={postUrl} className="group flex items-start gap-4">
      {/* Left side: content */}
      <div className="flex-1 min-w-0 pr-1">
        <span className="text-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest block mb-1 truncate">
          {categoryLabel}
        </span>
        <h3 className="text-[15px] lg:text-[17px] font-medium font-miller group-hover:text-gold transition-colors leading-snug line-clamp-3">
          {post.title}
        </h3>
      </div>

      {/* Right side: image */}
      <div className="w-24 h-20 lg:w-28 lg:h-20 shrink-0 relative overflow-hidden bg-muted">
        {post.mainImage ? (
          <Image
            src={urlFor(post.mainImage)
              .width(200)
              .height(150)
              .fit("crop")
              .url()}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gold/20 to-gold/5 flex items-center justify-center">
            <span className="text-gold/40 text-2xl font-miller">T</span>
          </div>
        )}
      </div>
    </Link>
  );
};
