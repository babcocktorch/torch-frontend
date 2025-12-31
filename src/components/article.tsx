import { cn, getDayMonthYear, formatDate } from "@/lib/utils";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import Link from "next/link";
import { PostProps } from "@/lib/types";
import { PAGES } from "@/lib/constants";

const Article = ({ post }: PostProps) => {
  const { day, month, year } = getDayMonthYear(post.date);

  const postUrl = post.slug === "#" ? "#" : PAGES.post(year, month, day, post.slug);

  return (
    <Link href={postUrl}>
      <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 cursor-pointer group">
        <div className="flex flex-col gap-4 w-full md:w-2/5">
          <p className={cn("font-miller", "text-2xl font-semibold")}>
            {post.title}
          </p>
          <p className="text-muted-foreground">{post.description}</p>
          <p className="text-sm text-muted-foreground">
            By{" "}
            <span className="font-medium text-primary">{post.author.name}</span>{" "}
            • {formatDate(post.date)}
          </p>

          {post.categories && (
            <div className="flex items-center justify-start gap-2 flex-wrap">
              {post.categories.map((category, i) => (
                <p
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-full font-medium border"
                >
                  {category.title}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="w-full md:w-3/5">
          {post.mainImage ? (
            <Image
              src={urlFor(post.mainImage)
                .width(500)
                .height(400)
                .fit("crop")
                .url()}
              alt={post.title}
              width={500}
              height={400}
              className="w-full h-auto object-cover"
            />
          ) : (
            <div className="w-full aspect-[5/4] bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <div className="text-gold/40 text-5xl font-miller">T</div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Article;
