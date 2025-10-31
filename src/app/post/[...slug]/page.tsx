import { sanityClient, urlFor } from "@/lib/sanity.client";
import { groq } from "next-sanity";
import { PortableText, toPlainText } from "@portabletext/react";
import { cn, readTime } from "@/lib/utils";
import { playfair } from "@/lib/fonts";
import React from "react";
import { notFound } from "next/navigation";
import { HiCalendar } from "react-icons/hi";
import { BiTime } from "react-icons/bi";
import Image from "next/image";
import { Metadata } from "next";
import { BASE_URL } from "@/lib/constants";

const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
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

// Dynamic metadata for SEO
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> => {
  const slug = (await params).slug.pop();

  if (!slug) return notFound();

  const post = await sanityClient.fetch(postQuery, { slug });

  if (!post) return notFound();

  return {
    title: post.title,
    metadataBase: new URL(BASE_URL + `/post/${post.slug}`),
    description: post.description,
    publisher: post.author.name,
    keywords: post.categories?.map((category: any) => category.title) || [],
    alternates: {
      canonical: BASE_URL + `/post/${post.slug}`,
    },
    openGraph: {
      images: urlFor(post.mainImage).width(1200).height(630).url() || "",
      url: BASE_URL + `/post/${post.slug}`,
      title: post.title,
      description: post.description,
      type: "article",
      siteName: "The Babcock Torch",
      authors: post.author.name,
      tags: post.categories?.map((category: any) => category.title) || [],
      publishedTime: post.publishedAt,
    },
    twitter: {
      title: post.title,
      description: post.description,
      images: urlFor(post.mainImage).width(1200).height(630).url() || "",
      // creator: post.author.twitterUrl
      //   ? `@${post.author.twitterUrl.split("twitter.com/")[1]}`
      //   : "@ibikunle_ibk",
      // site: post.author.twitterUrl
      //   ? `@${post.author.twitterUrl.split("twitter.com/")[1]}`
      //   : "@ibukunle_ibk",
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

  const post = await sanityClient.fetch(postQuery, { slug });

  if (!post) return notFound();

  const words = toPlainText(post.body || []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="max-w-4xl mx-auto md:px-16 px-6 my-8">
      <div className="grid lg:grid-cols-[75%,25%] grid-cols-1 gap-8">
        <article>
          {/* Post meta */}
          <div className="flex items-center flex-wrap gap-4 text-md mb-8 text-muted-foreground">
            {post.publishedAt && (
              <div className="flex items-center gap-x-2">
                <HiCalendar />
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
            )}
            <div className="flex items-center gap-x-2">
              <BiTime />
              <div>{readTime(words)}</div>
            </div>
          </div>

          {/* Title and Description */}
          <h1
            className={cn(
              "text-2xl sm:text-3xl lg:text-4xl font-medium leading-tight mb-6 text-foreground",
              playfair.className
            )}
          >
            {post.title}
          </h1>

          {post.description && (
            <p className="text-muted-foreground mb-6">{post.description}</p>
          )}

          <div className="my-8">
            <img
              src={urlFor(post.mainImage)
                .width(1200)
                .fit("max")
                .auto("format")
                .url()}
              alt={post.mainImage.alt || " "}
              loading="lazy"
              className="w-full h-auto rounded-sm"
            />
            {/* {value.caption && (
            <p className="text-sm text-muted-foreground mt-2 italic text-center">
              {value.caption}
            </p>
          )} */}
          </div>

          {/* Article Body */}
          {post.body && (
            <div
              className={cn(
                // "prose prose-lg max-w-none",
                // "prose-headings:font-serif prose-headings:text-foreground",
                // "prose-p:text-foreground prose-p:leading-7",
                // "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
                // "prose-strong:text-foreground prose-strong:font-semibold",
                // "prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-6 prose-blockquote:italic",
                // "prose-ul:text-foreground prose-ol:text-foreground",
                playfair.className
              )}
            >
              <PortableText value={post.body} components={ptComponents} />
            </div>
          )}
        </article>

        <aside className="flex flex-col gap-y-8">
          {post.author && (
            <section className="border-b border-border pb-10">
              <p className="text-sm text-muted-foreground">Written By</p>
              <address className="flex items-center gap-x-3 mt-4 not-italic">
                {post.author.image && (
                  <div className="relative w-12 h-12">
                    <Image
                      src={urlFor(post.author.image).width(80).height(80).url()}
                      alt={post.author.name}
                      fill
                      className="dark:bg-zinc-800 bg-zinc-300 rounded-full object-cover"
                    />
                  </div>
                )}
                <div rel="author">
                  <h3 className="font-semibold text-lg tracking-tight text-foreground">
                    {post.author.name}
                  </h3>
                  {post.author.twitterUrl && (
                    <a
                      href={post.author.twitterUrl}
                      className="text-blue-500 text-sm"
                      rel="noreferrer noopener"
                      target="_blank"
                    >
                      {`@${post.author.twitterUrl.split("twitter.com/")[1]}`}
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
