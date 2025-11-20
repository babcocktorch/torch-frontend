import ComingSoon from "@/components/general/coming-soon";
import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Vendors | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "Vendors are businesses that sell products and services to the public.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    url: BASE_URL + PAGES.vendors,
    title: "Vendors | The Babcock Torch",
    description:
      "Vendors are businesses that sell products and services to the public.",
    type: "website",
    siteName: "Vendors | The Babcock Torch",
  },
  twitter: {
    title: "Vendors | The Babcock Torch",
    description:
      "Vendors are businesses that sell products and services to the public.",
    images: BASE_URL + IMAGES.logos.logo.src,
    card: "summary_large_image",
  },
};

const VendorsPage = () => {
  return (
    <ComingSoon
      title="Vendors"
      description="Vendors is a platform for vendors to advertise and promote their products and services."
      showReturnButton={true}
    />
  );
};

export default VendorsPage;
