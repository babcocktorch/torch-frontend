import SearchPage from "@/components/search";
import { BASE_URL, IMAGES } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search the Torch — The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description: "Search the Torch to find articles, stories, and more.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    url: BASE_URL,
    title: "Search the Torch — The Babcock Torch",
    description: "Search the Torch to find articles, stories, and more.",
    type: "website",
    siteName: "The Babcock Torch",
  },
  twitter: {
    title: "Search the Torch — The Babcock Torch",
    description: "Search the Torch to find articles, stories, and more.",
    images: BASE_URL + IMAGES.logos.logo.src,
    card: "summary_large_image",
  },
};

const Search = () => {
  return <SearchPage />;
};

export default Search;
