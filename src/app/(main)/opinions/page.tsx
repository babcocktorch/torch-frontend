import { Separator } from "@/components/ui/separator";
import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";
import { getOpinions, getOpinionAuthors } from "@/lib/requests";
import { cn, formatDate } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import OpinionsSidebar from "@/components/opinions/opinions-sidebar";
import OpinionsCTA from "@/components/opinions/opinions-cta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Opinions | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "Opinions at the Babcock Torch is a platform for students to express their views and opinions on various topics.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    url: BASE_URL + PAGES.opinions,
    title: "Opinions | The Babcock Torch",
    description:
      "Opinions at the Babcock Torch is a platform for students to express their views and opinions on various topics.",
    type: "website",
    siteName: "Opinions | The Babcock Torch",
  },
  twitter: {
    title: "Opinions | The Babcock Torch",
    description:
      "Opinions at the Babcock Torch is a platform for students to express their views and opinions on various topics.",
    images: BASE_URL + IMAGES.logos.logo.src,
    card: "summary_large_image",
  },
};

const OpinionsPage = async () => {
  const opinions = await getOpinions();
  const authors = await getOpinionAuthors();

  return (
    <main className="w-full max-w-7xl mx-auto px-6 my-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-8 text-foreground font-semibold font-miller">
        Opinions
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content: Opinions List */}
        <div className="w-full lg:w-2/3 lg:border-r lg:pr-8">
          <div className="flex flex-col">
            {opinions.length === 0 ? (
              <p className="text-muted-foreground py-8">
                No opinions available at the moment.
              </p>
            ) : (
              opinions.map((opinion) => {
                const opinionUrl = PAGES.post(opinion.slug);

                return (
                  <React.Fragment key={opinion._id}>
                    <Link href={opinionUrl}>
                      <article className="w-full flex flex-col md:flex-row items-start gap-4 py-6 cursor-pointer group">
                        <p className="text-sm text-muted-foreground whitespace-nowrap pt-1 min-w-[100px]">
                          {formatDate(opinion.date)}
                        </p>

                        <div className="flex flex-col gap-2 flex-1">
                          <h2
                            className={cn(
                              domine.className,
                              "text-lg lg:text-xl font-semibold group-hover:text-gold transition-colors"
                            )}
                          >
                            {opinion.title}
                          </h2>
                          <p className="text-muted-foreground text-sm lg:text-base">
                            {opinion.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            By{" "}
                            <span className="font-medium text-foreground">
                              {opinion.author.name}
                            </span>
                          </p>
                        </div>
                      </article>
                    </Link>
                    <Separator />
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3">
          <OpinionsSidebar opinions={opinions} authors={authors} />
        </div>
      </div>

      {/* CTA at bottom */}
      <OpinionsCTA className="mt-12" />
    </main>
  );
};

export default OpinionsPage;
