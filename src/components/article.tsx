import { playfair } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import Image from "next/image";

const Article = () => {
  return (
    <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6">
      <div className="flex flex-col gap-4 w-full md:w-2/5">
        <p className={cn("text-2xl font-semibold", playfair.className)}>
          This is the topic of the article, says Victor
        </p>
        <p className="text-sm text-muted-foreground">
          Victor has claimed that this is the topic of the article and he is
          also writing the description of the article.
        </p>
        <p className="text-sm text-muted-foreground">
          By Victor Ibironke • Updated 21 Oct 2025
        </p>
      </div>

      <div className="w-full md:w-3/5">
        <Image
          src="/logos/E9sN5jzVUAUgYHn.png"
          alt="article"
          width={500}
          height={500}
          className="aspect-4/3 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Article;
