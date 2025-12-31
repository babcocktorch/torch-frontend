import { cn, getDayMonthYear } from "@/lib/utils";
import Link from "next/link";
import { PostType } from "@/lib/types";
import { PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";
import { IoIosArrowForward } from "react-icons/io";

interface MostReadProps {
  posts: PostType[];
  limit?: number;
}

const MostRead = ({ posts, limit = 5 }: MostReadProps) => {
  // For now, using most recent posts as placeholder for "most read"
  // This will be replaced with actual view count data when backend is ready
  const mostReadPosts = posts.slice(0, limit);

  return (
    <div className="w-full">
      <h6 className="flex items-center justify-start gap-1 font-medium mb-4 hover:gap-1.5 cursor-pointer transition-all">
        <span className="border-b-2 border-gold">Most Read</span>
        <IoIosArrowForward />
      </h6>

      <div className="flex flex-col">
        {mostReadPosts.map((post, index) => {
          const { day, month, year } = getDayMonthYear(post.date);
          const postUrl = post.slug === "#" ? "#" : PAGES.post(year, month, day, post.slug);

          return (
            <Link key={post._id} href={postUrl} className="group">
              <article className="flex items-start gap-3 py-3 border-b border-border last:border-b-0">
                <span className="text-2xl font-bold text-gold/60 font-miller leading-none pt-1">
                  {index + 1}
                </span>
                <h4
                  className={cn(
                    "text-sm lg:text-base font-medium group-hover:text-gold transition-colors leading-snug",
                    domine.className
                  )}
                >
                  {post.title}
                </h4>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MostRead;

