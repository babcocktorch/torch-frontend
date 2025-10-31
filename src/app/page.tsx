import Home from "@/components/home";
import { BASE_URL, IMAGES } from "@/lib/constants";
import { Metadata } from "next";

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

const HomePage = () => {
  return <Home />;
};

export default HomePage;
