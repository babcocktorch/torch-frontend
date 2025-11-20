import ComingSoon from "@/components/general/coming-soon";
import { Separator } from "@/components/ui/separator";
import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { domine } from "@/lib/fonts";
import { getOpinions } from "@/lib/requests";
import { cn, formatDate, getDayMonthYear } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Communities | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "Communities are groups of students who share a common interest or goal.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    url: BASE_URL + PAGES.communities,
    title: "Communities | The Babcock Torch",
    description:
      "Communities are groups of students who share a common interest or goal.",
    type: "website",
    siteName: "Communities | The Babcock Torch",
  },
  twitter: {
    title: "Communities | The Babcock Torch",
    description:
      "Communities are groups of students who share a common interest or goal.",
    images: BASE_URL + IMAGES.logos.logo.src,
    card: "summary_large_image",
  },
};

const CommunitiesPage = () => {
  return (
    <ComingSoon
      title="Communities"
      description="Communities are groups of students who share a common interest or goal."
      showReturnButton={true}
    />
  );
};

export default CommunitiesPage;
