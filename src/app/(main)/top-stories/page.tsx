import { BASE_URL, IMAGES } from "@/lib/constants";
import { getPosts } from "@/lib/requests";
import { Metadata } from "next";
import TopStoriesContent from "@/components/top-stories/home";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Top Stories | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "Browse every story ever published on The Babcock Torch — Babcock University's student-led publication.",
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    title: "Top Stories | The Babcock Torch",
    description: "Browse every story ever published on The Babcock Torch.",
    type: "website",
  },
};

const TopStoriesPage = async () => {
  const { posts } = await getPosts();
  const newsPosts = posts.filter((p) => p.isPost);

  return <TopStoriesContent posts={newsPosts} />;
};

export default TopStoriesPage;
