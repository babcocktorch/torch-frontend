import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import Link from "next/link";
import { PostType } from "@/lib/types";
import { PAGES } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

interface EditorsPickProps {
  featuredPost: PostType;
  secondaryPicks?: PostType[];
}

const EditorsPick = ({ featuredPost, secondaryPicks = [] }: EditorsPickProps) => {
  const postUrl =
    featuredPost.slug === "#" ? "#" : PAGES.post(featuredPost.slug);

  return (
    <div className="flex flex-col gap-6">
      {/* Primary Pick */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Featured Article Text */}
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
              <div className="w-full aspect-4/3 bg-linear-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <div className="text-gold/40 text-6xl font-miller">T</div>
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Secondary Picks */}
      {secondaryPicks.length > 0 && (
        <>
          {secondaryPicks.map((pick) => {
            const pickUrl =
              pick.slug === "#" ? "#" : PAGES.post(pick.slug);

            return (
              <div key={pick._id}>
                <Separator />
                <Link
                  href={pickUrl}
                  className="group block py-4"
                >
                  <h3
                    className={cn(
                      "text-lg lg:text-xl font-semibold group-hover:text-gold transition-colors",
                      "font-miller",
                    )}
                  >
                    {pick.title}
                  </h3>
                </Link>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default EditorsPick;
