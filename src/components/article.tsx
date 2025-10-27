import { playfair } from "@/lib/fonts";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import Link from "next/link";
import { ArticleProps } from "@/lib/types";
import { PAGES } from "@/lib/constants";

const Article = ({ post }: ArticleProps) => {
  // const date = new Date(post.publishedAt);

  // const year = date.getFullYear();
  // const month = date.getMonth() + 1;
  // const day = date.getDate();

  // const url = `/post/${year}/${month}/${day}/${post.slug}`;

  return (
    <Link href={PAGES.post(post.slug)}>
      <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 cursor-pointer group">
        <div className="flex flex-col gap-4 w-full md:w-3/5">
          <p className={cn("text-2xl font-semibold", playfair.className)}>
            {post.title}
          </p>
          <p className="text-muted-foreground">{post.description}</p>
          <p className="text-sm text-muted-foreground">
            By {post.author.name} • {formatDate(post.publishedAt)}
          </p>
        </div>

        <div className="w-full md:w-2/5">
          {post.mainImage && (
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
          )}
        </div>
      </div>
    </Link>
  );
};

export default Article;
