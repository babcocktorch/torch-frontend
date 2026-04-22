import { PAGES } from "@/lib/constants";
import { miller } from "@/lib/fonts";
import { urlFor } from "@/lib/sanity.client";
import { ImpactStoryType } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";

const ImpactStoryCard = ({ story }: { story: ImpactStoryType }) => {
  return (
    <Link href={PAGES.impactStory(story.slug)} className="group block">
      <article className="border rounded-xl overflow-hidden flex flex-col h-full bg-card hover:shadow-lg transition-shadow duration-200">
        {/* Cover Image */}
        <div className="relative w-full aspect-16/10 bg-muted">
          {story.mainImage ? (
            <Image
              src={urlFor(story.mainImage)
                .width(600)
                .height(375)
                .fit("crop")
                .url()}
              alt={story.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Users className="w-12 h-12 text-gold/40" />
            </div>
          )}

          {/* Featured Badge */}
          {story.featured && (
            <div className="absolute top-3 left-3 bg-gold text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
              Featured
            </div>
          )}

          {/* Community Badge */}
          {story.communityName && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {story.communityName}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-5 gap-2">
          <h3
            className={cn(
              miller.className,
              "text-lg font-semibold group-hover:text-gold transition-colors leading-tight line-clamp-2",
            )}
          >
            {story.title}
          </h3>

          {story.description && (
            <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
              {story.description}
            </p>
          )}

          {/* Footer: Author + Date */}
          <div className="flex items-center justify-between mt-auto pt-3 text-sm text-muted-foreground">
            {story.author?.name && (
              <span className="font-medium text-foreground truncate max-w-[60%]">
                {story.author.name}
              </span>
            )}
            {story.date && (
              <time dateTime={story.date} className="whitespace-nowrap">
                {formatDate(story.date)}
              </time>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ImpactStoryCard;
