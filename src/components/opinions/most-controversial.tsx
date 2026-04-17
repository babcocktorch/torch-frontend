import { PostType } from "@/lib/types";
import { georgia } from "@/lib/fonts";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";
import { PAGES } from "@/lib/constants";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";

export default function MostControversial({
  opinions,
}: {
  opinions: PostType[];
}) {
  // Use the same mock selection logic as sidebar for now (first 5 posts)
  const topControversial = opinions?.slice(0, 5) || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="mb-10 text-center">
        <h2
          className={cn(
            georgia.className,
            "text-3xl md:text-5xl font-bold mb-4",
          )}
        >
          Most Controversial
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The opinions that divided our readers the most. Explore the arguments
          and see where you stand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topControversial.map((opinion, idx) => {
          // Mock controversial stat values (e.g., 55/45 split, 51/49) descending slightly
          const agreePct = 50 + idx * 2;
          const disagreePct = 100 - agreePct;

          return (
            <article
              key={opinion._id}
              className="group flex flex-col h-full bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-all"
            >
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
                      georgia.className,
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
                  <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <BiSolidLike /> Agree
                    </span>
                    <span className="text-rose-600 flex items-center gap-1">
                      Disagree <BiSolidDislike />
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-1000"
                      style={{ width: `${agreePct}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-1000"
                      style={{ width: `${disagreePct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1.5 text-muted-foreground">
                    <span>{agreePct}%</span>
                    <span>{disagreePct}%</span>
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
