import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import Link from "next/link";
import { PostType } from "@/lib/types";
import { PAGES } from "@/lib/constants";
import { georgia } from "@/lib/fonts";

interface EditorsPickProps {
  featuredPost: PostType;
  secondaryPicks?: PostType[];
}

const EditorsPick = ({
  featuredPost,
  secondaryPicks = [],
}: EditorsPickProps) => {
  const postUrl =
    featuredPost.slug === "#" ? "#" : PAGES.post(featuredPost.slug);

  return (
    <div className="flex flex-col gap-6">
      {/* Main Editor's Pick */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Featured Article Text */}
        <div className="w-full lg:w-2/5 flex flex-col">
          {/* Editor's Pick Label */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1 h-4 bg-gold" />
            <span className="text-gold text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
              Editors Pick
            </span>
          </div>

          {/* Primary Pick */}
          <Link href={postUrl} className="group">
            <h2
              className={cn(
                "text-2xl lg:text-3xl font-semibold mb-3 group-hover:text-gold transition-colors",
                "font-miller",
              )}
            >
              {featuredPost.title}
            </h2>
            <p className="text-muted-foreground mb-3 text-sm lg:text-base">
              {featuredPost.description}
            </p>
            <p className="text-sm text-muted-foreground">
              By{" "}
              <span className="font-medium text-foreground">
                {featuredPost.author.name}
              </span>{" "}
              • {formatDate(featuredPost.date)}
            </p>
          </Link>
        </div>

        {/* Right: Featured Image */}
        <div className="w-full lg:w-3/5">
          <Link
            href={postUrl}
            className="block relative w-full h-full min-h-[250px]"
          >
            {featuredPost.mainImage ? (
              <Image
                src={urlFor(featuredPost.mainImage)
                  .width(800)
                  .height(600)
                  .fit("crop")
                  .url()}
                alt={featuredPost.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <div className="text-gold/40 text-6xl font-miller">T</div>
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Secondary Picks — horizontal card row below */}
      {secondaryPicks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {secondaryPicks.map((pick) => {
            const pickUrl = pick.slug === "#" ? "#" : PAGES.post(pick.slug);
            const categoryLabel = pick.categories?.[0]?.title;
            const categorySlug = pick.categories?.[0]?.slug || "news";
            const categoryUrl = PAGES.tag(categorySlug);

            return (
              <div key={pick._id} className="group block relative">
                <Link
                  href={pickUrl}
                  className="block relative w-full aspect-16/10 overflow-hidden bg-muted z-0"
                >
                  {pick.mainImage ? (
                    <Image
                      src={urlFor(pick.mainImage)
                        .width(500)
                        .height(312)
                        .fit("crop")
                        .url()}
                      alt={pick.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                      <div className="text-gold/40 text-4xl font-miller">T</div>
                    </div>
                  )}
                </Link>

                {/* Category label overlay */}
                {categoryLabel && (
                  <div className="absolute top-3 left-3 z-10">
                    <Link
                      href={categoryUrl}
                      className="bg-gold text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 hover:bg-gold/90 transition-colors"
                    >
                      {categoryLabel}
                    </Link>
                  </div>
                )}

                <Link href={pickUrl} className="block z-0 relative">
                  <h3
                    className={cn(
                      "text-sm lg:text-base font-semibold mt-2.5 group-hover:text-gold transition-colors leading-snug",
                      georgia.className,
                    )}
                  >
                    {pick.title}
                  </h3>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EditorsPick;
