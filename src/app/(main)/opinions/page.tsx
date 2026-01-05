import { Separator } from "@/components/ui/separator";
import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";
import { getOpinions, getOpinionAuthors } from "@/lib/requests";
import { cn, formatDate, getDayMonthYear } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import OpinionsSidebar from "@/components/opinions/opinions-sidebar";
import OpinionsCTA from "@/components/opinions/opinions-cta";
import { OpinionAuthor, PostType } from "@/lib/types";

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

// Dummy opinions for layout preview
const DUMMY_OPINIONS: PostType[] = [
  {
    _id: "dummy-op-1",
    title: "The Babcock Bubble: Our Greatest Asset or Our Biggest Liability?",
    slug: "#",
    mainImage: null,
    description:
      "Examining the isolation of campus life and what it means for students preparing for the real world.",
    date: "2025-11-14",
    isPublished: true,
    featured: false,
    isPost: false,
    author: { name: "The Critical Thinker" },
    categories: [{ title: "Opinions" }],
    body: [],
  },
  {
    _id: "dummy-op-2",
    title: "Can We Talk About Mental Health? Because It's Time",
    slug: "#",
    mainImage: null,
    description:
      "Breaking the silence on student wellbeing and why we need to start having honest conversations.",
    date: "2025-11-13",
    isPublished: true,
    featured: false,
    isPost: false,
    author: { name: "Anonymous" },
    categories: [{ title: "Opinions" }],
    body: [],
  },
  {
    _id: "dummy-op-3",
    title:
      "Why I'm Starting a Business While Still in School (And Why You Should Too)",
    slug: "#",
    mainImage: null,
    description:
      "A case for student entrepreneurship and the lessons you can only learn by doing.",
    date: "2025-11-12",
    isPublished: true,
    featured: false,
    isPost: false,
    author: { name: "The Entrepreneur" },
    categories: [{ title: "Opinions" }],
    body: [],
  },
  {
    _id: "dummy-op-4",
    title: "The Library at Midnight: A Love Letter and a Plea",
    slug: "#",
    mainImage: null,
    description:
      "Reflections on late-night study sessions and what the library means to us.",
    date: "2025-11-11",
    isPublished: true,
    featured: false,
    isPost: false,
    author: { name: "The Night Owl" },
    categories: [{ title: "Opinions" }],
    body: [],
  },
  {
    _id: "dummy-op-5",
    title:
      'In Defense of "Boring" Babcock: Why Our Calm Campus Is Actually Our Strength',
    slug: "#",
    mainImage: null,
    description:
      "Finding value in the quiet and why we should appreciate what we have.",
    date: "2025-11-10",
    isPublished: true,
    featured: false,
    isPost: false,
    author: { name: "The Contemplative One" },
    categories: [{ title: "Opinions" }],
    body: [],
  },
  {
    _id: "dummy-op-6",
    title:
      "We're Too Comfortable: Why Babcock Needs an Extracurricular Revolution",
    slug: "#",
    mainImage: null,
    description:
      "A call for more student activities and why comfort zones are holding us back.",
    date: "2025-11-09",
    isPublished: true,
    featured: false,
    isPost: false,
    author: { name: "The Restless Student" },
    categories: [{ title: "Opinions" }],
    body: [],
  },
  {
    _id: "dummy-op-7",
    title:
      "The Cafeteria Crisis: It's Time We Talked About Quality, Not Just Quantity",
    slug: "#",
    mainImage: null,
    description:
      "Examining campus dining options and why students deserve better.",
    date: "2025-11-08",
    isPublished: true,
    featured: false,
    isPost: false,
    author: { name: "A Concerned Stomach" },
    categories: [{ title: "Opinions" }],
    body: [],
  },
  {
    _id: "dummy-op-8",
    title:
      "Why Babcock's Ranking Shouldn't Define Us (But Our Response Should)",
    slug: "#",
    mainImage: null,
    description:
      "Moving beyond university rankings and focusing on what really matters.",
    date: "2025-11-07",
    isPublished: true,
    featured: false,
    isPost: false,
    author: { name: "Student Voice" },
    categories: [{ title: "Opinions" }],
    body: [],
  },
  {
    _id: "dummy-op-9",
    title:
      "Has BUSA really done more good than harm? I'm yet to see their efforts this semester!",
    slug: "#",
    mainImage: null,
    description:
      "A critical look at student government and their impact on campus life.",
    date: "2025-11-06",
    isPublished: true,
    featured: false,
    isPost: false,
    author: { name: "AntiBusa" },
    categories: [{ title: "Opinions" }],
    body: [],
  },
  {
    _id: "dummy-op-10",
    title: "The recent school fees reduction issued by the VP has a catch",
    slug: "#",
    mainImage: null,
    description:
      "Looking beyond the headlines at what the fee reduction really means.",
    date: "2025-11-05",
    isPublished: true,
    featured: false,
    isPost: false,
    author: { name: "The Skeptic" },
    categories: [{ title: "Opinions" }],
    body: [],
  },
];

// Dummy authors for layout preview
const DUMMY_AUTHORS: OpinionAuthor[] = [
  { name: "The Critical Thinker", slug: null, opinionCount: 5 },
  { name: "Anonymous", slug: null, opinionCount: 4 },
  { name: "The Entrepreneur", slug: null, opinionCount: 3 },
  { name: "The Night Owl", slug: null, opinionCount: 3 },
  { name: "The Contemplative One", slug: null, opinionCount: 2 },
  { name: "The Restless Student", slug: null, opinionCount: 2 },
  { name: "A Concerned Stomach", slug: null, opinionCount: 1 },
  { name: "Student Voice", slug: null, opinionCount: 1 },
];

const OpinionsPage = async () => {
  const realOpinions = await getOpinions();
  const realAuthors = await getOpinionAuthors();

  // Fill with dummy data if not enough real content
  const opinions =
    realOpinions.length >= 10
      ? realOpinions
      : [...realOpinions, ...DUMMY_OPINIONS.slice(realOpinions.length)];

  const authors =
    realAuthors.length >= 6
      ? realAuthors
      : [...realAuthors, ...DUMMY_AUTHORS.slice(realAuthors.length)];

  return (
    <main className="w-full max-w-7xl mx-auto px-6 my-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-8 text-foreground font-semibold font-miller">
        Opinions
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content: Opinions List */}
        <div className="w-full lg:w-2/3 lg:border-r lg:pr-8">
          <div className="flex flex-col">
            {opinions.map((opinion) => {
              const { day, month, year } = getDayMonthYear(opinion.date);
              const opinionUrl =
                opinion.slug === "#"
                  ? "#"
                  : PAGES.post(year, month, day, opinion.slug);

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
            })}
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
