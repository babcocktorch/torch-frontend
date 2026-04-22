import { OpinionAuthor } from "@/lib/types";
import { miller } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PAGES } from "@/lib/constants";
import { FaPenNib } from "react-icons/fa";

export default function Opinionists({ authors }: { authors: OpinionAuthor[] }) {
  // Sort authors by opinion count
  const sortedAuthors = [...authors].sort(
    (a, b) => b.opinionCount - a.opinionCount,
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="mb-12 text-center">
        <h2
          className={cn(
            miller.className,
            "text-3xl md:text-5xl font-bold mb-4",
          )}
        >
          Our Opinionists
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          The voices shaping the discourse. Discover our prolific writers and
          explore their collected arguments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedAuthors.map((author) => {
          return (
            <Link
              key={author.name}
              href={author.slug ? PAGES.author(author.slug) : "#"}
              className={cn(
                "group relative flex flex-col items-center justify-center p-8 bg-card rounded-2xl border transition-all text-center",
                author.slug
                  ? "hover:border-gold hover:shadow-md cursor-pointer"
                  : "hover:border-border cursor-default opacity-80",
              )}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-gold/20 to-transparent rounded-bl-full rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6 border-2 border-transparent group-hover:border-gold/50 transition-colors shadow-sm">
                <FaPenNib className="text-3xl text-gold/60" />
              </div>

              <h3
                className={cn(
                  miller.className,
                  "text-xl font-bold mb-2 group-hover:text-gold transition-colors",
                )}
              >
                {author.name}
              </h3>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-xs font-semibold text-muted-foreground">
                <span className="text-gold">{author.opinionCount}</span>
                {author.opinionCount === 1 ? "Opinion" : "Opinions"}
              </div>

              {!author.slug && (
                <p className="text-[10px] text-muted-foreground mt-4 absolute bottom-4">
                  Profile not available
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
