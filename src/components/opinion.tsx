import { getDayMonthYear } from "@/lib/utils";
import Link from "next/link";
import { OpinionProps } from "@/lib/types";
import { PAGES } from "@/lib/constants";

const Opinion = ({ opinion }: OpinionProps) => {
  const { day, month, year } = getDayMonthYear(opinion.publishedAt);

  const opinionUrl = PAGES.opinion(year, month, day, opinion.slug);

  return (
    <Link href={opinionUrl}>
      <div className="pb-6 border-b">
        <p className="text-muted-foreground text-sm mb-2">
          {opinion.author.name}
        </p>
        <h4 className="font-miller text-base lg:text-lg">{opinion.title}</h4>
      </div>
    </Link>
  );
};

export default Opinion;
