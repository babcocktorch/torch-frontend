import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { getOpinions, getOpinionAuthors } from "@/lib/requests";
import { Metadata } from "next";
import OpinionsHome from "@/components/opinions/home";

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

const OpinionsPage = async () => {
  const { opinions, featuredOpinionSlug } = await getOpinions();
  const authors = await getOpinionAuthors();

  return (
    <OpinionsHome
      opinions={opinions}
      authors={authors}
      featuredOpinionSlug={featuredOpinionSlug}
    />
  );
};

export default OpinionsPage;
