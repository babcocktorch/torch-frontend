import { BASE_URL, IMAGES } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Streaming | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "Watch live streams, broadcasts, and special events from The Babcock Torch.",
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    title: "Streaming | The Babcock Torch",
    description:
      "Watch live streams, broadcasts, and special events from The Babcock Torch.",
    type: "website",
  },
};

export default function StreamingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
