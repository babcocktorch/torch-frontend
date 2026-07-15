import { sanityClient, urlFor } from "@/lib/sanity.client";
import { groq } from "next-sanity";
import { PortableText, toPlainText } from "@portabletext/react";
import { cn, readTime } from "@/lib/utils";
import React from "react";
import { notFound } from "next/navigation";
import { HiCalendar } from "react-icons/hi";
import { BiSolidTime } from "react-icons/bi";
import { Metadata } from "next";
import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { PostType } from "@/lib/types";
import SharePost from "@/components/general/share-post";
import FeaturedPosts from "@/components/general/featured-posts";
import PostReactions from "@/components/general/post-reactions";
import ReadTracker from "@/components/general/read-tracker";
import { Comments } from "@/components/general/comments";
import Image from "next/image";
import Link from "next/link";
import { isArticlePublic } from "@/lib/requests";
import { ptComponents } from "@/components/general/portable-text-components";
import { Users } from "lucide-react";

const postQuery = groq`
  *[_type == "Post" && isPublished == true && slug.current == $slug][0] {
    _id,
    title,
    description,
    mainImage,
    articleType,
    communitySlug,
    communityName,
    body,
    date,
    authors[]->{
      name,
      "slug": slug.current,
      image
    },
    "categories": categories[]->{
      title,
      "slug": slug.current
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
    publisher: post.authors.map((a) => a.name).join(", ") || "Unknown Author",
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
      authors: post.authors.map((a) => a.name).join(", ") || "Unknown Author",
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

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  if (!slug) return notFound();

  // Check if article is public via backend
  const isPublic = await isArticlePublic(slug);
  if (!isPublic) return notFound();

  const post: PostType = await sanityClient.fetch(postQuery, { slug });

  if (!post) return notFound();

  const words = toPlainText(post.body || []);

  const isBimun = post.categories?.some((c: any) => c.slug === "bimun26");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-6 my-8">
      {isBimun && (
        <div className="relative w-full overflow-hidden rounded-2xl bg-slate-900 text-white mb-10 shadow-lg border border-[#3157CC]/30 group">
          <div className="absolute inset-0 bg-linear-to-br from-[#3157CC]/40 via-transparent to-[#DC9814]/20 opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#3157CC] rounded-full mix-blend-screen filter blur-[3rem] opacity-50 animate-pulse"></div>
          <div className="absolute top-1/2 -right-12 w-32 h-32 bg-[#FFDC61] rounded-full mix-blend-screen filter blur-[3rem] opacity-30"></div>

          <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="hidden md:flex shrink-0 w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/20 items-center justify-center shadow-[0_0_15px_rgba(49,87,204,0.3)] overflow-hidden">
                <Image
                  src={IMAGES.bimun_logo.src}
                  alt="BIMUN Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold tracking-[0.2em] text-slate-300 uppercase">
                    International Press
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-miller font-semibold tracking-tight text-white">
                  BIMUN26 Special Coverage
                </h2>
              </div>
            </div>

            {/* <div className="flex gap-2 w-full md:w-auto opacity-80">
              <div className="h-1.5 flex-1 md:w-8 bg-[#3157CC] rounded-full"></div>
              <div className="h-1.5 flex-1 md:w-8 bg-[#FFDC61] rounded-full"></div>
              <div className="h-1.5 flex-1 md:w-8 bg-[#DC9814] rounded-full"></div>
              <div className="h-1.5 flex-1 md:w-8 bg-white/80 rounded-full"></div>
            </div> */}
          </div>
        </div>
      )}
      <article className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] relative">
        <div className="min-h-full lg:border-r border-r-0 pb-4 lg:pr-6 px-0">
          {/* Community Badge for Impact Stories */}
          {post.articleType === "Impact Story" && post.communityName && (
            <Link
              href={
                post.communitySlug
                  ? PAGES.community(post.communitySlug)
                  : PAGES.communities
              }
              className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-4 font-semibold"
            >
              <Users className="w-4 h-4" />
              {post.communityName}
            </Link>
          )}

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
            {post.articleType !== "Opinion" && (
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
            <div
              className={cn(
                // miller.className,
                "text-sm lg:text-base",
              )}
            >
              <PortableText value={post.body} components={ptComponents} />
            </div>
          )}

          {isBimun && (
            <div className="mt-10 border-t pt-6">
              <p className="text-xs text-muted-foreground/70 leading-relaxed italic">
                This article was produced by a delegate of the International
                Press Committee at BIMUN26, simulating international press
                coverage. It does not represent the named press organization or
                the editorial voice of The Babcock Torch.
              </p>
            </div>
          )}

          {post.articleType === "Opinion" && <PostReactions slug={slug} />}
          {post.articleType === "Opinion" && <Comments slug={slug} />}

          {/* Silent read tracking */}
          <ReadTracker slug={slug} />
        </div>

        <aside className="flex flex-col lg:max-h-full h-max gap-y-6 sticky top-24 bottom-auto right-0 lg:pl-6 pl-0">
          <section className="border-b pb-6">
            <p className="text-muted-foreground text-sm">Written By</p>
            {post.authors.map((a, i) => (
              <address
                className="flex items-center gap-x-3 mt-4 not-italic"
                key={i}
              >
                <div className="relative w-10 h-10">
                  <img
                    src={
                      a.image
                        ? urlFor(a.image).width(80).height(80).url()
                        : `https://api.dicebear.com/9.x/lorelei-neutral/png?seed=${a.name || "Unknown"}`
                    }
                    alt={a.name || "Unknown Author"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover border"
                  />
                </div>
                <div rel="author">
                  {a.slug ? (
                    <Link href={PAGES.author(a.slug)}>
                      <h3 className="font-medium tracking-tight hover:text-primary transition-colors cursor-pointer">
                        {a.name}
                      </h3>
                    </Link>
                  ) : (
                    <h3 className="font-medium tracking-tight">
                      {a.name || "Unknown Author"}
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
            ))}
          </section>

          {post.categories && (
            <section className="border-b pb-6">
              <h3 className="lg:text-lg font-semibold tracking-tight mb-4">
                Categories
              </h3>
              <div className="flex flex-wrap items-center gap-2 tracking-tight">
                {post.categories.map((category, i) => (
                  <Link
                    key={i}
                    href={PAGES.tag(
                      category.slug ||
                        category.title.toLowerCase().replace(/\s+/g, "-"),
                    )}
                    className={cn(
                      "text-sm px-2.5 py-1 rounded-full font-medium border hover:bg-muted transition-colors",
                      category.slug === "bimun26" &&
                        "bg-[#3157CC] text-white border-[#3157CC] hover:bg-[#3157CC]/90",
                    )}
                  >
                    {category.title}
                  </Link>
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
