import { urlFor } from "@/lib/sanity.client";
import { PortableText } from "@portabletext/react";
import { cn } from "@/lib/utils";
import { georgia } from "@/lib/fonts";
import React from "react";
import { notFound } from "next/navigation";
import { HiCalendar } from "react-icons/hi";
import { Metadata } from "next";
import { BASE_URL, PAGES } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { getImpactStory } from "@/lib/requests";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const story = await getImpactStory(slug);

  if (!story) {
    return { title: "Story Not Found — The Babcock Torch" };
  }

  const imageUrl = story.mainImage
    ? urlFor(story.mainImage).width(1200).height(630).url()
    : "";

  return {
    title: `${story.title} — Impact Stories | The Babcock Torch`,
    metadataBase: new URL(BASE_URL),
    description: story.description || `An impact story from The Babcock Torch.`,
    alternates: {
      canonical: `${BASE_URL}${PAGES.impactStory(story.slug)}`,
    },
    openGraph: {
      images: imageUrl,
      url: `${BASE_URL}${PAGES.impactStory(story.slug)}`,
      title: story.title,
      description:
        story.description || `An impact story from The Babcock Torch.`,
      type: "article",
      siteName: "The Babcock Torch",
      authors: story.author?.name || undefined,
      publishedTime: story.date,
    },
    twitter: {
      title: story.title,
      description:
        story.description || `An impact story from The Babcock Torch.`,
      images: imageUrl,
      card: "summary_large_image",
    },
  };
};

// Portable Text components (reuse the same pattern as post detail page)
const ptComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) return null;

      return (
        <div className="my-8">
          <img
            src={urlFor(value).width(1200).fit("max").auto("format").url()}
            alt={value.alt || "Story Image"}
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

const ImpactStoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  if (!slug) return notFound();

  const story = await getImpactStory(slug);

  if (!story) return notFound();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="w-full max-w-3xl mx-auto px-6 my-8">
      {/* Back Link */}
      <Link
        href={PAGES.communities}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Communities
      </Link>

      <article>
        {/* Community Tag */}
        {story.communityName && (
          <Link
            href={
              story.communitySlug
                ? PAGES.community(story.communitySlug)
                : PAGES.communities
            }
            className="inline-flex items-center gap-2 text-sm text-gold hover:underline mb-4"
          >
            <Users className="w-4 h-4" />
            {story.communityName}
          </Link>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <HiCalendar />
          <time dateTime={story.date}>{formatDate(story.date)}</time>
        </div>

        {/* Title */}
        <h1 className="font-miller font-semibold tracking-tight text-3xl sm:text-4xl lg:text-5xl lg:leading-[3.5rem] mb-4">
          {story.title}
        </h1>

        {/* Description */}
        {story.description && (
          <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mb-8">
            {story.description}
          </p>
        )}

        {/* Author */}
        {story.author && (
          <div className="flex items-center gap-3 mb-8 pb-8 border-b">
            <img
              src={
                story.author.image
                  ? urlFor(story.author.image).width(80).height(80).url()
                  : `https://api.dicebear.com/9.x/lorelei-neutral/png?seed=${story.author.name}`
              }
              alt={story.author.name}
              width={40}
              height={40}
              className="rounded-full object-cover border"
            />
            <div>
              {story.author.slug ? (
                <Link href={PAGES.author(story.author.slug)}>
                  <p className="font-medium hover:text-gold transition-colors">
                    {story.author.name}
                  </p>
                </Link>
              ) : (
                <p className="font-medium">{story.author.name}</p>
              )}
            </div>
          </div>
        )}

        {/* Cover Image */}
        {story.mainImage && (
          <div className="mb-8">
            <Image
              src={urlFor(story.mainImage)
                .width(1200)
                .fit("max")
                .auto("format")
                .url()}
              width={1200}
              height={630}
              alt={story.mainImage.alt || "Story Cover"}
              loading="lazy"
              className="w-full h-auto rounded-sm"
            />
          </div>
        )}

        {/* Body */}
        {story.body && (
          <div className={cn(georgia.className, "text-sm lg:text-base")}>
            <PortableText value={story.body} components={ptComponents} />
          </div>
        )}
      </article>
    </main>
  );
};

export default ImpactStoryPage;
