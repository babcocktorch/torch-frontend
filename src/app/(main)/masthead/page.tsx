import ComingSoon from "@/components/general/coming-soon";
import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Masthead | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "The Masthead is the editorial team that oversees the publication of The Babcock Torch.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    url: BASE_URL + PAGES.masthead,
    title: "Masthead | The Babcock Torch",
    description:
      "The Masthead is the editorial team that oversees the publication of The Babcock Torch.",
    type: "website",
    siteName: "Masthead | The Babcock Torch",
  },
  twitter: {
    title: "Masthead | The Babcock Torch",
    description:
      "The Masthead is the editorial team that oversees the publication of The Babcock Torch.",
    images: BASE_URL + IMAGES.logos.logo.src,
    card: "summary_large_image",
  },
};

const MastheadPage = () => {
  return (
    <ComingSoon
      title="Masthead"
      description="The Masthead is the editorial team that oversees the publication of The Babcock Torch."
      showReturnButton={true}
    />
  );
};

export default MastheadPage;
