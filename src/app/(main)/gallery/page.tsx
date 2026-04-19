import { BASE_URL, IMAGES } from "@/lib/constants";
import { Metadata } from "next";
import GalleryContent from "@/components/gallery/home";

export const metadata: Metadata = {
  title: "Gallery | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "Browse photo albums from campus events, community activities, and student life at Babcock University.",
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    title: "Gallery | The Babcock Torch",
    description:
      "Browse photo albums from campus events, community activities, and student life at Babcock University.",
    type: "website",
  },
};

const GalleryPage = () => {
  return <GalleryContent />;
};

export default GalleryPage;
