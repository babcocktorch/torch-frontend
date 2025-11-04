import { sanityClient, urlFor } from "@/lib/sanity.client";
import { groq } from "next-sanity";
import { PortableText, toPlainText } from "@portabletext/react";
import { cn, getDayMonthYear, readTime } from "@/lib/utils";
import { domine } from "@/lib/fonts";
import React from "react";
import { notFound } from "next/navigation";
import { HiCalendar } from "react-icons/hi";
import { BiTime } from "react-icons/bi";
import Image from "next/image";
import { Metadata } from "next";
import { BASE_URL, PAGES } from "@/lib/constants";

const opinionQuery = groq`
  *[_type == "opinion" && slug.current == $slug][0] {
    _id,
    title,
    description,
    mainImage,
    body,
    publishedAt,
    author->{
      name,
      bio,
      image,
      twitterUrl
    },
    "categories": categories[]->{
      title
    },
    "slug": slug.current
  }
`;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> => {
  const slug = (await params).slug.pop();

  if (!slug) return notFound();

  const opinion = await sanityClient.fetch(opinionQuery, { slug });

  if (!opinion) return notFound();

  const { day, month, year } = getDayMonthYear(opinion.publishedAt);

  const url = PAGES.opinion(year, month, day, opinion.slug);

  return {
    title: opinion.title,
    metadataBase: new URL(BASE_URL + url),
    description: opinion.description,
    publisher: opinion.author.name,
    keywords: opinion.categories?.map((category: any) => category.title) || [],
    alternates: {
      canonical: BASE_URL + url,
    },
    openGraph: {
      images: opinion.mainImage
        ? urlFor(opinion.mainImage).width(1200).height(630).url()
        : "",
      url: BASE_URL + url,
      title: opinion.title,
      description: opinion.description,
      type: "article",
      siteName: "The Babcock Torch",
      authors: opinion.author.name,
      tags: opinion.categories?.map((category: any) => category.title) || [],
      publishedTime: opinion.publishedAt,
    },
    twitter: {
      title: opinion.title,
      description: opinion.description,
      images: opinion.mainImage
        ? urlFor(opinion.mainImage).width(1200).height(630).url()
        : "",
      card: "summary_large_image",
    },
  };
};

const ptComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) {
        return null;
      }

      return (
        <div className="my-8">
          <img
            src={urlFor(value).width(1200).fit("max").auto("format").url()}
            alt={value.alt || " "}
            loading="lazy"
            className="w-full h-auto rounded-sm"
          />
          {value.caption && (
            <p className="text-sm text-muted-foreground mt-2 italic text-center">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-3xl font-bold mb-6 mt-8 leading-tight">{children}</h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl font-semibold mb-4 mt-6 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl font-semibold mb-3 mt-5 leading-tight">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-7 text-foreground">{children}</p>
    ),
  },
};

const PostPage = async ({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) => {
  const slug = (await params).slug.pop();

  if (!slug) return notFound();

  const opinion = await sanityClient.fetch(opinionQuery, { slug });

  if (!opinion) return notFound();

  const words = toPlainText(opinion.body || []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="max-w-4xl mx-auto px-6 my-8">
      <div className="grid grid-cols-1 gap-8">
        <article>
          {/* Post meta */}
          <div className="flex items-center flex-wrap gap-4 text-md mb-8 text-muted-foreground">
            {opinion.publishedAt && (
              <div className="flex items-center gap-x-2">
                <HiCalendar />
                <time dateTime={opinion.publishedAt}>
                  {formatDate(opinion.publishedAt)}
                </time>
              </div>
            )}
            <div className="flex items-center gap-x-2">
              <BiTime />
              <div>{readTime(words)}</div>
            </div>
          </div>

          <h1
            className={cn(
              // domine.className,
              "font-miller",
              "text-2xl sm:text-3xl lg:text-4xl leading-tight mb-6 text-foreground font-semibold"
            )}
          >
            {opinion.title}
          </h1>

          {opinion.description && (
            <p className="text-muted-foreground mb-6">{opinion.description}</p>
          )}

          {opinion.mainImage && (
            <div className="my-8">
              <img
                src={urlFor(opinion.mainImage)
                  .width(1200)
                  .fit("max")
                  .auto("format")
                  .url()}
                alt={opinion.mainImage.alt || " "}
                loading="lazy"
                className="w-full h-auto rounded-sm"
              />
            </div>
          )}

          {opinion.body && (
            <div className={cn(domine.className, "text-sm lg:text-base")}>
              <PortableText value={opinion.body} components={ptComponents} />
            </div>
          )}
        </article>

        <aside className="flex flex-col gap-y-8">
          {opinion.author && (
            <section className="border-b border-border pb-10">
              <p className="text-sm text-muted-foreground">Written By</p>
              <address className="flex items-center gap-x-3 mt-4 not-italic">
                {opinion.author.image && (
                  <div className="relative w-12 h-12">
                    <Image
                      src={urlFor(opinion.author.image)
                        .width(80)
                        .height(80)
                        .url()}
                      alt={opinion.author.name}
                      fill
                      className="dark:bg-zinc-800 bg-zinc-300 rounded-full object-cover"
                    />
                  </div>
                )}
                <div rel="author">
                  <h3 className="font-semibold text-base lg:text-lg tracking-tight text-foreground">
                    {opinion.author.name}
                  </h3>
                  {opinion.author.twitterUrl && (
                    <a
                      href={opinion.author.twitterUrl}
                      className="text-blue-500 text-sm"
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {`@${opinion.author.twitterUrl.split("twitter.com/")[1]}`}
                    </a>
                  )}
                </div>
              </address>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
};

export default PostPage;
