import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { getCommunityBySlug } from "@/lib/requests";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Users, Mail, ArrowLeft, Calendar, Send } from "lucide-react";
import { domine } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import SubmissionForm from "@/components/communities/submission-form";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const { data: community } = await getCommunityBySlug(slug);

  if (!community) {
    return {
      title: "Community Not Found — The Babcock Torch",
    };
  }

  const imageUrl = community.logoUrl || BASE_URL + IMAGES.logos.logo.src;

  return {
    title: `${community.name} — The Babcock Torch`,
    metadataBase: new URL(BASE_URL),
    description:
      community.description ||
      `Stay updated with news, events, and announcements from ${community.name}.`,
    alternates: {
      canonical: `${BASE_URL}${PAGES.communities}/${slug}`,
    },
    openGraph: {
      images: imageUrl,
      url: `${BASE_URL}${PAGES.communities}/${slug}`,
      title: `${community.name} — The Babcock Torch`,
      description:
        community.description ||
        `Stay updated with news, events, and announcements from ${community.name}.`,
      type: "profile",
      siteName: "The Babcock Torch",
    },
    twitter: {
      title: `${community.name} — The Babcock Torch`,
      description:
        community.description ||
        `Stay updated with news, events, and announcements from ${community.name}.`,
      images: imageUrl,
      card: "summary",
    },
  };
};

const CommunityPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const { data: community, error } = await getCommunityBySlug(slug);

  if (!community || error) {
    return notFound();
  }

  const formattedDate = new Date(community.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
    }
  );

  return (
    <main className="w-full max-w-4xl mx-auto px-6 my-8">
      {/* Back Link */}
      <Link
        href={PAGES.communities}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Communities
      </Link>

      {/* Community Header */}
      <div className="flex flex-col items-center text-center gap-6 pb-8 border-b">
        {/* Logo */}
        {community.logoUrl ? (
          <Image
            src={community.logoUrl}
            alt={community.name}
            width={128}
            height={128}
            className="rounded-full object-cover border-2"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gold/10 flex items-center justify-center">
            <Users className="w-16 h-16 text-gold" />
          </div>
        )}

        {/* Name & Description */}
        <div className="flex flex-col gap-4">
          <h1
            className={cn(
              domine.className,
              "text-2xl sm:text-3xl lg:text-4xl font-semibold"
            )}
          >
            {community.name}
          </h1>

          {community.description && (
            <p className="text-muted-foreground max-w-2xl">
              {community.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Joined {formattedDate}</span>
            </div>
            {community._count && (
              <div className="flex items-center gap-1.5">
                <Send className="w-4 h-4" />
                <span>
                  {community._count.submissions}{" "}
                  {community._count.submissions === 1
                    ? "submission"
                    : "submissions"}
                </span>
              </div>
            )}
          </div>

          {/* Contact Email */}
          {community.contactEmail && (
            <a
              href={`mailto:${community.contactEmail}`}
              className="inline-flex items-center gap-2 text-sm text-gold hover:underline"
            >
              <Mail className="w-4 h-4" />
              {community.contactEmail}
            </a>
          )}
        </div>

        {/* Submit Button */}
        <SubmissionForm
          community={community}
          trigger={
            <Button className="mt-2">
              <Send className="w-4 h-4 mr-2" />
              Submit Content
            </Button>
          }
        />
      </div>

      {/* Content Section */}
      <div className="py-12">
        <div className="text-center">
          <h2
            className={cn(domine.className, "text-xl sm:text-2xl font-semibold mb-4")}
          >
            Community Updates
          </h2>
          <p className="text-muted-foreground mb-8">
            News, events, and announcements from {community.name} will appear
            here once approved.
          </p>

          {/* Placeholder for future content */}
          <div className="border border-dashed rounded-lg p-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No published content yet.</p>
            <p className="text-sm mt-2">
              Be the first to submit news or an event!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CommunityPage;
