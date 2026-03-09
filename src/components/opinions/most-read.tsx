import { PostType } from "@/lib/types";
import { domine } from "@/lib/fonts";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";
import { PAGES } from "@/lib/constants";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";

export default function MostRead({ opinions }: { opinions: PostType[] }) {
  // Use the same mock selection logic as sidebar for now
  const popularPosts = opinions?.slice(0, 10) || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="mb-12 text-center">
        <h2
          className={cn(
            domine.className,
            "text-3xl md:text-5xl font-bold mb-4",
          )}
        >
          Most Read
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The opinions that are trending across campus. Join the conversation on
          our most popular pieces.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {popularPosts.map((opinion, idx) => {
          // Mock read count descending for demonstration
          const readCount = 1500 - idx * 125;

          return (
            <article
              key={opinion._id}
              className="group relative flex flex-col h-full bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Giant Number Rank Overlay */}
              {/* <div className="absolute top-0 right-3 text-7xl font-miller font-bold text-white/50 z-20 select-none drop-shadow-md pointer-events-none">
                {String(idx + 1).padStart(2, "0")}
              </div> */}

              <Link
                href={PAGES.post(opinion.slug)}
                className="relative aspect-video w-full bg-muted block overflow-hidden"
              >
                {opinion.mainImage ? (
                  <Image
                    src={urlFor(opinion.mainImage)
                      .width(600)
                      .height(400)
                      .fit("crop")
                      .url()}
                    alt={opinion.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gold/10 flex items-center justify-center">
                    <span className="text-gold/40 text-4xl font-miller">T</span>
                  </div>
                )}
              </Link>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center text-xs text-muted-foreground mb-3 gap-2">
                  <span>{formatDate(opinion.date)}</span>
                  <span>•</span>
                  <span>
                    By{" "}
                    {opinion.author.slug ? (
                      <Link
                        href={PAGES.author(opinion.author.slug)}
                        className="font-medium text-foreground hover:text-gold transition-colors"
                      >
                        {opinion.author.name}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">
                        {opinion.author.name}
                      </span>
                    )}
                  </span>
                </div>

                <Link href={PAGES.post(opinion.slug)}>
                  <h3
                    className={cn(
                      domine.className,
                      "text-xl font-bold mb-2 group-hover:text-gold transition-colors line-clamp-2",
                    )}
                  >
                    {opinion.title}
                  </h3>
                </Link>

                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                  {opinion.description}
                </p>

                <div className="mt-auto pt-4 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-gold">
                      {readCount.toLocaleString()} Reads
                    </span>
                    <Link
                      href={PAGES.post(opinion.slug)}
                      className="font-semibold text-muted-foreground hover:text-gold transition-colors uppercase tracking-widest"
                    >
                      Read Opinion
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
