import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { miller } from "@/lib/fonts";
import { getPostsByTag } from "@/lib/requests";
import { cn, formatDate } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const tagTitle = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const title = `${tagTitle} Tag | The Babcock Torch`;

  return {
    title,
    metadataBase: new URL(BASE_URL),
    description: `Articles and opinions tagged under ${tagTitle} at The Babcock Torch.`,
    alternates: {
      canonical: BASE_URL + PAGES.tag(slug),
    },
    openGraph: {
      images: BASE_URL + IMAGES.logos.logo.src,
      url: BASE_URL + PAGES.tag(slug),
      title,
      description: `Articles and opinions tagged under ${tagTitle} at The Babcock Torch.`,
      type: "website",
      siteName: "The Babcock Torch",
    },
    twitter: {
      title,
      description: `Articles and opinions tagged under ${tagTitle} at The Babcock Torch.`,
      images: BASE_URL + IMAGES.logos.logo.src,
      card: "summary_large_image",
    },
  };
}

const TagPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  // Format the slug for display if needed
  const tagTitle = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const results = await getPostsByTag(slug);

  const posts = results.filter((post) => post.isPost);
  const opinions = results.filter((post) => !post.isPost);

  return (
    <main className="max-w-4xl mx-auto px-6 my-8 w-full min-h-screen">
      <div className="mb-12">
        <p className="text-muted-foreground uppercase tracking-widest text-sm font-semibold mb-2">
          Tag Archive
        </p>
        <h1 className="font-miller text-3xl md:text-4xl lg:text-5xl font-medium w-full text-foreground">
          {tagTitle}
        </h1>
      </div>

      {results.length === 0 && (
        <p className="font-miller text-xl md:text-2xl font-medium w-full text-center text-muted-foreground py-12">
          No articles found with the tag &ldquo;{tagTitle}&rdquo;.
        </p>
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-12">
          {posts.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold font-miller">
                Articles
              </h2>

              <div className="grid grid-cols-1 gap-8">
                {posts.map((post) => {
                  const postUrl = PAGES.post(post.slug);

                  return (
                    <React.Fragment key={post._id}>
                      <Link href={postUrl}>
                        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 cursor-pointer group">
                          <div className="flex flex-row items-start gap-6 w-full">
                            <p className="text-sm text-muted-foreground whitespace-nowrap pt-1">
                              {formatDate(post.date)}
                            </p>

                            <div className="flex flex-col gap-2">
                              <p
                                className={cn(
                                  miller.className,
                                  "sm:text-lg lg:text-xl font-semibold group-hover:text-primary transition-colors",
                                )}
                              >
                                {post.title}
                              </p>
                              <p className="text-muted-foreground">
                                {post.description}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                By{" "}
                                <span className="font-primary font-medium">
                                  {post.author.name}
                                </span>
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
            </div>
          )}

          {opinions.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold font-miller">
                Opinions
              </h2>

              <div className="grid grid-cols-1 gap-8">
                {opinions.map((opinion) => {
                  const opinionUrl = PAGES.post(opinion.slug);

                  return (
                    <React.Fragment key={opinion._id}>
                      <Link href={opinionUrl}>
                        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-6 cursor-pointer group">
                          <div className="flex flex-row items-start gap-6 w-full">
                            <p className="text-sm text-muted-foreground whitespace-nowrap pt-1">
                              {formatDate(opinion.date)}
                            </p>

                            <div className="flex flex-col gap-2">
                              <p
                                className={cn(
                                  miller.className,
                                  "sm:text-lg lg:text-xl font-semibold group-hover:text-primary transition-colors",
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
                        </div>
                      </Link>
                      <Separator />
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default TagPage;
