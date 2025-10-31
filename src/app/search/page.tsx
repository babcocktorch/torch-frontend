import { Input } from "@/components/ui/input";
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
  return (
    <main className="max-w-4xl mx-auto px-6 my-8 w-full min-h-screen">
      <Input placeholder="Search" className="h-auto p-4 rounded-none mb-12" />

      <p className="font-miller text-2xl md:text-3xl lg:text-4xl font-medium w-full text-center">
        Enter a search term to get started
      </p>
    </main>
  );
};

export default Search;
