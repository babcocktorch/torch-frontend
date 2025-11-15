import { Separator } from "@/components/ui/separator";
import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";
import { getOpinions } from "@/lib/requests";
// import { getOpinions } from "@/lib/requests";
import { urlFor } from "@/lib/sanity.client";
import { cn, formatDate, getDayMonthYear } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

  return (
    <main className="w-full max-w-4xl mx-auto px-6 my-8">
      <div className="grid grid-cols-1 gap-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-6 text-foreground font-semibold font-miller">
          Opinions
        </h1>

        <div className="grid grid-cols-1 gap-8">
          {opinions.map((opinion) => {
            const { day, month, year } = getDayMonthYear(opinion.date);

            const opinionUrl = PAGES.post(year, month, day, opinion.slug);

            return (
              <React.Fragment key={opinion._id}>
                <Link href={opinionUrl}>
                  <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 cursor-pointer group">
                    <div className="flex flex-row items-start gap-6 w-full md:w-3/4">
                      <p className="text-sm text-muted-foreground whitespace-nowrap pt-1">
                        {formatDate(opinion.date)}
                      </p>

                      <div className="flex flex-col gap-2">
                        <p
                          className={cn(
                            domine.className,
                            "sm:text-lg lg:text-xl font-semibold"
                          )}
                        >
                          {opinion.title}
                        </p>
                        <p className="text-muted-foreground">
                          {opinion.description}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          By{" "}
                          <span className="font-primary font-medium">
                            {opinion.author.name}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-1/4">
                      {opinion.mainImage && (
                        <Image
                          src={urlFor(opinion.mainImage)
                            .width(500)
                            .height(400)
                            .fit("crop")
                            .url()}
                          alt={opinion.title}
                          width={500}
                          height={400}
                          className="w-full h-auto object-cover"
                        />
                      )}
                    </div>
                  </div>
                </Link>

                <Separator />
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default OpinionsPage;
