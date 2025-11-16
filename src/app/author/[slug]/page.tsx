import { Separator } from "@/components/ui/separator";
import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";
import { getAuthor, getAuthorPosts } from "@/lib/requests";
import { urlFor } from "@/lib/sanity.client";
import { cn, formatDate, getDayMonthYear } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { PortableText } from "@portabletext/react";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;

  const author = await getAuthor(slug);

  if (!author) {
    return {
      title: "Author Not Found — The Babcock Torch",
    };
  }

  const authorImageUrl = author.image
    ? urlFor(author.image).width(800).height(800).url()
    : `https://api.dicebear.com/9.x/lorelei-neutral/png?seed=${author.name}`;

  return {
    title: `${author.name} — The Babcock Torch`,
    metadataBase: new URL(BASE_URL),
    description: `Read articles by ${author.name} on The Babcock Torch.`,
    alternates: {
      canonical: BASE_URL + PAGES.author(slug),
    },
    openGraph: {
      images: authorImageUrl,
      url: BASE_URL + PAGES.author(slug),
      title: `${author.name} — The Babcock Torch`,
      description: `Read articles by ${author.name} on The Babcock Torch.`,
      type: "profile",
      siteName: "The Babcock Torch",
    },
    twitter: {
      title: `${author.name} — The Babcock Torch`,
      description: `Read articles by ${author.name} on The Babcock Torch.`,
      images: authorImageUrl,
      card: "summary",
    },
  };
};

const AuthorPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const author = await getAuthor(slug);

  if (!author) {
    return notFound();
  }

  const posts = await getAuthorPosts(author.name);

  const authorImageUrl = author.image
    ? urlFor(author.image).width(400).height(400).url()
    : `https://api.dicebear.com/9.x/lorelei-neutral/png?seed=${author.name}`;

  return (
    <main className="w-full max-w-4xl mx-auto px-6 my-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Author Header */}
        <div className="flex flex-col items-center text-center gap-6 pb-8 border-b">
          <div className="relative w-32 h-32">
            <Image
              src={authorImageUrl}
              alt={author.name}
              width={128}
              height={128}
              className="rounded-full object-cover border-2"
            />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-miller">
              {author.name}
            </h1>

            {author.bio && author.bio.length > 0 && (
              <div className="text-muted-foreground max-w-2xl prose prose-sm">
                <PortableText
                  value={author.bio}
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="mb-2">{children}</p>
                      ),
                    },
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>{posts.length}</span>
              <span>
                {posts.length === 1 ? "Article" : "Articles"} Published
              </span>
            </div>
          </div>
        </div>

        {/* Author's Articles */}
        <div className="flex flex-col gap-6">
          <h2 className="text-xl sm:text-2xl font-semibold font-miller">
            Articles by {author.name}
          </h2>

          {posts.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">
              No articles published yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {posts.map((post) => {
                const { day, month, year } = getDayMonthYear(post.date);
                const postUrl = PAGES.post(year, month, day, post.slug);

                return (
                  <React.Fragment key={post._id}>
                    <Link href={postUrl}>
                      <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 cursor-pointer group">
                        <div className="flex flex-row items-start gap-6 w-full">
                          <p className="text-sm text-muted-foreground whitespace-nowrap pt-1">
                            {formatDate(post.date)}
                          </p>

                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {post.isPost ? (
                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                                  Article
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                                  Opinion
                                </span>
                              )}
                            </div>

                            <p
                              className={cn(
                                domine.className,
                                "sm:text-lg lg:text-xl font-semibold group-hover:text-primary transition-colors"
                              )}
                            >
                              {post.title}
                            </p>
                            <p className="text-muted-foreground">
                              {post.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <Separator />
                  </React.Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AuthorPage;
