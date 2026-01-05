import ComingSoon from "@/components/general/coming-soon";
import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Policy | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description: "The Policy is the editorial policy of The Babcock Torch.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    url: BASE_URL + PAGES.policy,
    title: "Policy | The Babcock Torch",
    description: "The Policy is the editorial policy of The Babcock Torch.",
    type: "website",
    siteName: "Policy | The Babcock Torch",
  },
  twitter: {
    title: "Policy | The Babcock Torch",
    description: "The Policy is the editorial policy of The Babcock Torch.",
    images: BASE_URL + IMAGES.logos.logo.src,
    card: "summary_large_image",
  },
};

const PolicyPage = () => {
  return (
    <ComingSoon
      title="Policy"
      description="The Policy is the editorial policy of The Babcock Torch."
      showReturnButton={true}
    />
  );
};

export default PolicyPage;
