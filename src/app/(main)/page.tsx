import Home from "@/components/home";
import { BASE_URL, IMAGES } from "@/lib/constants";
import { getPosts } from "@/lib/requests";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "The Babcock Torch is a student-led publication dedicated to amplifying the voices of the Babcock University community.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    url: BASE_URL,
    title: "The Babcock Torch",
    description:
      "The Babcock Torch is a student-led publication dedicated to amplifying the voices of the Babcock University community.",
    type: "website",
    siteName: "The Babcock Torch",
  },
  twitter: {
    title: "The Babcock Torch",
    description:
      "The Babcock Torch is a student-led publication dedicated to amplifying the voices of the Babcock University community.",
    images: BASE_URL + IMAGES.logos.logo.src,
    card: "summary_large_image",
  },
};

const HomePage = async () => {
  const { posts, editorsPickSlugs } = await getPosts();

  // Create dummy posts for layout testing by duplicating existing news posts
  const newsPosts = posts.filter((p) => p.isPost);
  let dummyPosts = [...posts];

  // Keep duplicating news posts until we have enough to fill all grids (needs ~14 news posts total)
  while (dummyPosts.filter((p) => p.isPost).length < 16) {
    const clonedPosts = newsPosts.map((post, index) => ({
      ...post,
      _id: `${post._id}-clone-${dummyPosts.length}-${index}`,
      slug: `${post.slug}-clone-${dummyPosts.length}-${index}`,
    }));
    dummyPosts = [...dummyPosts, ...clonedPosts];
  }

  return <Home posts={dummyPosts} editorsPickSlugs={editorsPickSlugs} />;
};

export default HomePage;
