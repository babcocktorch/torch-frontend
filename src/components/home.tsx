"use client";

import Article from "@/components/article";
import { Separator } from "@/components/ui/separator";
import { PAGES } from "@/lib/constants";
import { Fragment } from "react";
import { PostType } from "@/lib/types";
import { IoIosArrowForward } from "react-icons/io";
import Opinion from "./opinion";
import Link from "next/link";
import MostRead from "./general/most-read";
import CompressedArticle from "./general/compressed-article";
import ContributorCTA from "./general/contributor-cta";
import EditorsPick from "./general/editors-pick";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.client";
import { cn, getDayMonthYear } from "@/lib/utils";
import { domine } from "@/lib/fonts";

// Dummy data for layout preview
const DUMMY_NEWS: PostType[] = [
  {
    _id: "dummy-1",
    title: "The First Light: Why Babcock Needs The Torch",
    slug: "#",
    mainImage: null,
    description:
      "A new student-run publication is stepping up to record Babcock University's overlooked achievements — from hosting global tech leaders to the quiet triumphs that too often go undocumented.",
    date: "2025-11-16",
    isPublished: true,
    featured: true,
    isPost: true,
    author: { name: "The Editorial Board" },
    categories: [{ title: "News" }],
    body: [],
  },
  {
    _id: "dummy-2",
    title: "New exam timetable drops, sparking campus-wide Panic!",
    slug: "#",
    mainImage: null,
    description:
      "Students react to the sudden release of examination schedules.",
    date: "2025-11-15",
    isPublished: true,
    featured: false,
    isPost: true,
    author: { name: "News Desk" },
    categories: [{ title: "News" }],
    body: [],
  },
  {
    _id: "dummy-3",
    title: "Library extends closing hours as exam pressure begins to build",
    slug: "#",
    mainImage: null,
    description:
      "The university library announces extended hours for students.",
    date: "2025-11-14",
    isPublished: true,
    featured: false,
    isPost: true,
    author: { name: "Campus Reporter" },
    categories: [{ title: "News" }],
    body: [],
  },
  {
    _id: "dummy-4",
    title: "What is The Babcock Torch?",
    slug: "#",
    mainImage: null,
    description:
      "The Babcock Torch is a student-led publication dedicated to amplifying the voices of the Babcock University community. Built on truth, creativity, and community, it aims to inform, inspire, and document the stories that define campus life.",
    date: "2025-11-14",
    isPublished: true,
    featured: false,
    isPost: true,
    author: { name: "Osedebame Itamah" },
    categories: [{ title: "Blogs" }],
    body: [],
  },
  {
    _id: "dummy-5",
    title: "School of Computing (BUCC) celebrates its 25th Year anniversary!",
    slug: "#",
    mainImage: null,
    description:
      "The School of Computing marks a quarter century of excellence in technology education.",
    date: "2025-11-13",
    isPublished: true,
    featured: false,
    isPost: true,
    author: { name: "Tech Correspondent" },
    categories: [{ title: "News" }],
    body: [],
  },
  {
    _id: "dummy-6",
    title: "Blackbones makes it to the freshers fest 2nd act Announcement",
    slug: "#",
    mainImage: null,
    description: "Popular artist confirmed for campus event.",
    date: "2025-11-12",
    isPublished: true,
    featured: false,
    isPost: true,
    author: { name: "Entertainment Desk" },
    categories: [{ title: "Entertainment" }],
    body: [],
  },
  {
    _id: "dummy-7",
    title: "Mass Communications Students launch campus Podcast",
    slug: "#",
    mainImage: null,
    description: "A new voice for student stories emerges.",
    date: "2025-11-11",
    isPublished: true,
    featured: false,
    isPost: true,
    author: { name: "Media Reporter" },
    categories: [{ title: "News" }],
    body: [],
  },
  {
    _id: "dummy-8",
    title: "Press One Africa visits Babcock during BUCC 25th Anniversary",
    slug: "#",
    mainImage: null,
    description: "Tech company representatives tour the campus.",
    date: "2025-11-10",
    isPublished: true,
    featured: false,
    isPost: true,
    author: { name: "Tech Correspondent" },
    categories: [{ title: "News" }],
    body: [],
  },
  {
    _id: "dummy-9",
    title: "CS 25th Anniversary: The Good, The Bad, and The Ugly",
    slug: "#",
    mainImage: null,
    description: "A comprehensive look at the anniversary celebrations.",
    date: "2025-11-09",
    isPublished: true,
    featured: false,
    isPost: true,
    author: { name: "Senior Reporter" },
    categories: [{ title: "News" }],
    body: [],
  },
  {
    _id: "dummy-10",
    title:
      "Who is marluvstare? The face behind the Biggest twitter account in Babcock",
    slug: "#",
    mainImage: null,
    description: "Uncovering the identity behind the viral account.",
    date: "2025-11-08",
    isPublished: true,
    featured: false,
    isPost: true,
    author: { name: "Features Writer" },
    categories: [{ title: "Features" }],
    body: [],
  },
  {
    _id: "dummy-11",
    title: '"No more paper attendance", swapped for ID cards',
    slug: "#",
    mainImage: null,
    description: "University introduces new attendance tracking system.",
    date: "2025-11-07",
    isPublished: true,
    featured: false,
    isPost: true,
    author: { name: "Admin Reporter" },
    categories: [{ title: "News" }],
    body: [],
  },
];

const DUMMY_OPINIONS: PostType[] = [
  {
    _id: "dummy-op-1",
    title: "The Babcock Bubble: Our Greatest Asset or Our Biggest Liability?",
    slug: "#",
    mainImage: null,
    description: "Examining the isolation of campus life.",
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
    description: "Breaking the silence on student wellbeing.",
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
    description: "A case for student entrepreneurship.",
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
    description: "Reflections on late-night study sessions.",
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
    description: "Finding value in the quiet.",
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
    description: "A call for more student activities.",
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
    description: "Examining campus dining options.",
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
    description: "Moving beyond university rankings.",
    date: "2025-11-07",
    isPublished: true,
    featured: false,
    isPost: false,
    author: { name: "Student Voice" },
    categories: [{ title: "Opinions" }],
    body: [],
  },
];

const Home = ({ posts }: { posts: PostType[] }) => {
  // Separate news posts and opinions
  const realNewsPosts = posts.filter((post) => post.isPost);
  const realOpinions = posts.filter((post) => !post.isPost);

  // Fill with dummy data if not enough real posts
  const newsPosts =
    realNewsPosts.length >= 11
      ? realNewsPosts
      : [...realNewsPosts, ...DUMMY_NEWS.slice(realNewsPosts.length)];

  const opinions =
    realOpinions.length >= 8
      ? realOpinions
      : [...realOpinions, ...DUMMY_OPINIONS.slice(realOpinions.length)];

  // Layout distribution:
  // - Editor's Pick: 1 featured post
  // - Secondary headlines in editor's pick: 2 posts
  // - Additional articles with images: 2 posts
  // - More Top Stories: remaining posts (compressed)
  const editorsPick = newsPosts[0];
  const secondaryHeadlines = newsPosts.slice(1, 3);
  const additionalArticles = newsPosts.slice(3, 5);
  const moreTopStories = newsPosts.slice(5, 11);
  const moreTopStoriesWithImage = moreTopStories[0];
  const moreTopStoriesCompressed = moreTopStories.slice(1);

  return (
    <main className="w-full max-w-7xl flex flex-col items-center justify-start py-8 gap-8 px-6">
      {/* Hero Section: Editor's Pick + Opinions */}
      <section className="w-full flex flex-col lg:flex-row gap-6">
        {/* Left: Editor's Pick + Additional Articles */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6 lg:border-r lg:pr-6">
          {/* Editor's Pick */}
          {editorsPick && (
            <EditorsPick
              featuredPost={editorsPick}
              secondaryHeadlines={secondaryHeadlines}
            />
          )}

          <Separator />

          {/* Additional Articles with Images */}
          {additionalArticles.map((post, index) => (
            <Fragment key={post._id}>
              <Article post={post} />
              {index < additionalArticles.length - 1 && <Separator />}
            </Fragment>
          ))}
        </div>

        {/* Right: Opinions Sidebar */}
        <div className="w-full lg:w-1/4 flex flex-col gap-4">
          <h6 className="flex items-center justify-start gap-1 font-medium hover:gap-1.5 cursor-pointer transition-all">
            <Link href={PAGES.opinions} className="border-b-2 border-gold">
              Opinions
            </Link>{" "}
            <IoIosArrowForward />
          </h6>

          {opinions.slice(0, 8).map((post) => (
            <Opinion key={post._id} post={post} />
          ))}
        </div>
      </section>

      {/* More Top Stories + Most Read Section */}
      {moreTopStories.length > 0 && (
        <section className="w-full flex flex-col lg:flex-row gap-6">
          {/* More Top Stories */}
          <div className="w-full lg:w-3/4 lg:border-r lg:pr-6">
            <h6 className="flex items-center justify-start gap-1 font-medium mb-6 hover:gap-1.5 cursor-pointer transition-all">
              <span className="border-b-2 border-gold">More Top Stories</span>
              <IoIosArrowForward />
            </h6>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Featured Story with Image */}
              {moreTopStoriesWithImage && (
                <div className="w-full md:w-2/5">
                  <MoreTopStoriesFeature post={moreTopStoriesWithImage} />
                </div>
              )}

              {/* Compressed List */}
              <div className="w-full md:w-3/5">
                {moreTopStoriesCompressed.map((post) => (
                  <CompressedArticle key={post._id} post={post} />
                ))}
              </div>
            </div>
          </div>

          {/* Most Read Sidebar */}
          <div className="w-full lg:w-1/4">
            <MostRead posts={newsPosts} limit={5} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <ContributorCTA className="my-4" />
    </main>
  );
};

// Sub-component for More Top Stories featured article
const MoreTopStoriesFeature = ({ post }: { post: PostType }) => {
  const { day, month, year } = getDayMonthYear(post.date);
  const postUrl =
    post.slug === "#" ? "#" : PAGES.post(year, month, day, post.slug);

  return (
    <Link href={postUrl} className="group block">
      {post.mainImage ? (
        <Image
          src={urlFor(post.mainImage).width(400).height(300).fit("crop").url()}
          alt={post.title}
          width={400}
          height={300}
          className="w-full h-auto object-cover mb-4"
        />
      ) : (
        <div className="w-full aspect-[4/3] bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mb-4">
          <div className="text-gold/40 text-4xl font-miller">T</div>
        </div>
      )}
      <h3
        className={cn(
          "text-base lg:text-lg font-medium group-hover:text-gold transition-colors",
          domine.className
        )}
      >
        {post.title}
      </h3>
    </Link>
  );
};

export default Home;
