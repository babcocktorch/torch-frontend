import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";
import { PostProps } from "@/lib/types";
import { PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";

const CompressedArticle = ({ post }: PostProps) => {
  const postUrl = post.slug === "#" ? "#" : PAGES.post(post.slug);

  return (
    <Link href={postUrl} className="group">
      <article className="py-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors -mx-2 px-2 rounded">
        <h3
          className={cn(
            "text-base lg:text-lg font-medium group-hover:text-gold transition-colors",
            domine.className
          )}
        >
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {formatDate(post.date)}
        </p>
      </article>
    </Link>
  );
};

export default CompressedArticle;
