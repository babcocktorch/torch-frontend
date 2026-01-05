import ComingSoon from "@/components/general/coming-soon";
import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Business | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "Business is a platform for businesses to advertise and promote their products and services.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    url: BASE_URL + PAGES.business,
    title: "Business | The Babcock Torch",
    description:
      "Business is a platform for businesses to advertise and promote their products and services.",
    type: "website",
    siteName: "Business | The Babcock Torch",
  },
  twitter: {
    title: "Business | The Babcock Torch",
    description:
      "Business is a platform for businesses to advertise and promote their products and services.",
    images: BASE_URL + IMAGES.logos.logo.src,
    card: "summary_large_image",
  },
};

const BusinessPage = () => {
  return (
    <ComingSoon
      title="Business"
      description="Business is a platform for businesses to advertise and promote their products and services."
      showReturnButton={true}
    />
  );
};

export default BusinessPage;
