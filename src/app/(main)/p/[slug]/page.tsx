import { sanityClient, urlFor } from "@/lib/sanity.client";
import { groq } from "next-sanity";
import { PortableText, toPlainText } from "@portabletext/react";
import { cn, readTime } from "@/lib/utils";
import { domine } from "@/lib/fonts";
import React from "react";
import { notFound } from "next/navigation";
import { HiCalendar } from "react-icons/hi";
import { BiSolidTime } from "react-icons/bi";
import { Metadata } from "next";
import { BASE_URL, PAGES } from "@/lib/constants";
import { PostType } from "@/lib/types";
import SharePost from "@/components/general/share-post";
import FeaturedPosts from "@/components/general/featured-posts";
import PostReactions from "@/components/general/post-reactions";
import Image from "next/image";
import Link from "next/link";
import { isArticlePublic } from "@/lib/requests";

const postQuery = groq`
  *[_type == "Post" && isPublished == true && slug.current == $slug][0] {
    _id,
    title,
    description,
    mainImage,
    isPost,
    body,
    date,
    author->{
      name,
      "slug": slug.current,
      image
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
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;

  if (!slug) return notFound();

  const post: PostType = await sanityClient.fetch(postQuery, { slug });

  if (!post) return notFound();

  const url = PAGES.post(post.slug);

  return {
    title: post.title,
    metadataBase: new URL(BASE_URL + url),
    description: post.description,
    publisher: post.author.name,
    keywords: post.categories?.map((category: any) => category.title) || [],
    alternates: {
      canonical: BASE_URL + url,
    },
    openGraph: {
      images: post.mainImage
        ? urlFor(post.mainImage).width(1200).height(630).url()
        : "",
      url: BASE_URL + url,
      title: post.title,
      description: post.description,
      type: "article",
      siteName: "The Babcock Torch",
      authors: post.author.name,
      tags: post.categories?.map((category: any) => category.title) || [],
      publishedTime: post.date,
    },
    twitter: {
      title: post.title,
      description: post.description,
      images: post.mainImage
        ? urlFor(post.mainImage).width(1200).height(630).url()
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
            alt={value.alt || "Post Image"}
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

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  if (!slug) return notFound();

  // Check if article is public via backend
  const isPublic = await isArticlePublic(slug);
  if (!isPublic) return notFound();

  const post: PostType = await sanityClient.fetch(postQuery, { slug });

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
    <main className="w-full max-w-7xl mx-auto px-6 my-8">
      <article className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] relative">
        <div className="min-h-full lg:border-r border-r-0 pb-4 lg:pr-6 px-0">
          <div className="flex items-center flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-x-2 text-sm lg:text-base">
              <HiCalendar />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>

            <div className="flex items-center gap-x-2 text-sm lg:text-base">
              <BiSolidTime />
              <div>{readTime(words)}</div>
            </div>
          </div>

          <header className="my-8">
            <h1 className="max-w-3xl font-miller font-semibold tracking-tight sm:text-5xl text-3xl lg:leading-[3.7rem]">
              {post.title}
            </h1>
            {post.isPost && (
              <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mt-6">
                {post.description}
              </p>
            )}
          </header>

          <div className="relative w-full h-auto">
            {post.mainImage && (
              <div className="mx-auto my-4">
                <Image
                  src={urlFor(post.mainImage)
                    .width(1200)
                    .fit("max")
                    .auto("format")
                    .url()}
                  width={1200}
                  height={630}
                  alt={post.mainImage.alt || "Post Image"}
                  loading="lazy"
                  className="w-full h-auto rounded-sm"
                />
              </div>
            )}
          </div>

          {post.body && (
            <div className={cn(domine.className, "text-sm lg:text-base")}>
              <PortableText value={post.body} components={ptComponents} />
            </div>
          )}

          {!post.isPost && <PostReactions postId={post._id} />}
        </div>

        <aside className="flex flex-col lg:max-h-full h-max gap-y-6 sticky top-24 bottom-auto right-0 lg:pl-6 pl-0">
          <section className="border-b pb-6">
            <p className="text-muted-foreground text-sm">Written By</p>
            <address className="flex items-center gap-x-3 mt-4 not-italic">
              <div className="relative w-10 h-10">
                <img
                  src={
                    post.author.image
                      ? urlFor(post.author.image).width(80).height(80).url()
                      : `https://api.dicebear.com/9.x/lorelei-neutral/png?seed=${post.author.name}`
                  }
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover border"
                />
              </div>
              <div rel="author">
                {post.author.slug ? (
                  <Link href={PAGES.author(post.author.slug)}>
                    <h3 className="font-medium text-lg tracking-tight hover:text-primary transition-colors cursor-pointer">
                      {post.author.name}
                    </h3>
                  </Link>
                ) : (
                  <h3 className="font-medium text-lg tracking-tight">
                    {post.author.name}
                  </h3>
                )}
                {/* <a
                    href={post.author.twitterUrl}
                    className="text-blue-500 text-sm"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {`@${post.author.twitterUrl.split("twitter.com/")[1]}`}
                  </a> */}
              </div>
            </address>
          </section>

          {post.categories && (
            <section className="border-b pb-6">
              <h3 className="lg:text-lg font-semibold tracking-tight mb-4">
                Categories
              </h3>
              <div className="flex flex-wrap items-center gap-2 tracking-tight">
                {post.categories.map((category, i) => (
                  <p
                    key={i}
                    className="text-sm px-2.5 py-1 rounded-full font-medium border"
                  >
                    {category.title}
                  </p>
                ))}
              </div>
            </section>
          )}

          <SharePost
            title={post.title}
            slug={post.slug}
            description={post.description}
            date={post.date}
          />

          <section className="border-b pb-6">
            <h3 className="lg:text-lg font-semibold tracking-tight mb-4">
              Featured
            </h3>

            <FeaturedPosts slug={slug} />
          </section>
        </aside>
      </article>
    </main>
  );
};

export default PostPage;
