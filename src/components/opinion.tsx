import { getDayMonthYear } from "@/lib/utils";
import Link from "next/link";
import { PostProps } from "@/lib/types";
import { PAGES } from "@/lib/constants";

const Opinion = ({ post }: PostProps) => {
  const { day, month, year } = getDayMonthYear(post.date);

  const opinionUrl = post.slug === "#" ? "#" : PAGES.post(year, month, day, post.slug);

  return (
    <Link href={opinionUrl}>
      <div className="pb-6 border-b">
        <p className="text-muted-foreground text-sm mb-2">{post.author.name}</p>
        <h4 className="font-miller text-base lg:text-lg">{post.title}</h4>
      </div>
    </Link>
  );
};

export default Opinion;
