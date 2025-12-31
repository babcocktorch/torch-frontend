import { OpinionAuthor, PostType } from "@/lib/types";
import { cn, getDayMonthYear } from "@/lib/utils";
import { domine } from "@/lib/fonts";
import Link from "next/link";
import { PAGES } from "@/lib/constants";

interface OpinionsSidebarProps {
  opinions: PostType[];
  authors: OpinionAuthor[];
}

const OpinionsSidebar = ({ opinions, authors }: OpinionsSidebarProps) => {
  // Most Controversial: For now, use random selection as placeholder
  // Will be replaced with actual vote data when backend is ready
  const mostControversial = opinions.slice(0, 4);

  // Most Read: For now, use most recent as placeholder
  // Will be replaced with actual view count data when backend is ready
  const mostRead = opinions.slice(0, 5);

  // Opinionists: Authors sorted by opinion count (already sorted from API)
  const topOpinionists = authors.slice(0, 6);

  return (
    <aside className="w-full flex flex-col gap-8">
      {/* Most Controversial */}
      <section>
        <h3 className="flex items-center gap-2 font-medium mb-4">
          <span className="border-b-2 border-gold">Most Controversial</span>
        </h3>
        <div className="flex flex-col gap-3">
          {mostControversial.map((opinion) => {
            const { day, month, year } = getDayMonthYear(opinion.date);
            const url =
              opinion.slug === "#"
                ? "#"
                : PAGES.post(year, month, day, opinion.slug);

            return (
              <Link key={opinion._id} href={url} className="group">
                <article className="py-2 border-b border-border last:border-b-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    {opinion.author.name}
                  </p>
                  <h4
                    className={cn(
                      "text-sm font-medium group-hover:text-gold transition-colors leading-snug",
                      domine.className
                    )}
                  >
                    {opinion.title}
                  </h4>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Most Read Opinions */}
      <section>
        <h3 className="flex items-center gap-2 font-medium mb-4">
          <span className="border-b-2 border-gold">Most Read Opinions</span>
        </h3>
        <div className="flex flex-col">
          {mostRead.map((opinion, index) => {
            const { day, month, year } = getDayMonthYear(opinion.date);
            const url =
              opinion.slug === "#"
                ? "#"
                : PAGES.post(year, month, day, opinion.slug);

            return (
              <Link key={opinion._id} href={url} className="group">
                <article className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
                  <span className="text-xl font-bold text-gold/60 font-miller leading-none pt-0.5">
                    {index + 1}
                  </span>
                  <h4
                    className={cn(
                      "text-sm font-medium group-hover:text-gold transition-colors leading-snug",
                      domine.className
                    )}
                  >
                    {opinion.title}
                  </h4>
                </article>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Opinionists */}
      <section>
        <h3 className="flex items-center gap-2 font-medium mb-4">
          <span className="border-b-2 border-gold">Opinionists</span>
        </h3>
        <div className="flex flex-col gap-2">
          {topOpinionists.map((author) => (
            <div
              key={author.name}
              className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
            >
              <span className="text-sm font-medium">{author.name}</span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {author.opinionCount}{" "}
                {author.opinionCount === 1 ? "opinion" : "opinions"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default OpinionsSidebar;
