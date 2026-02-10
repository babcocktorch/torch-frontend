import CommunitiesHome from "@/components/communities/home";
// import ComingSoon from "@/components/general/coming-soon";
import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { getCommunities } from "@/lib/requests";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Communities | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "Discover campus organizations, clubs, and groups. Stay updated with their latest news, events, and announcements.",
  alternates: {
    canonical: BASE_URL + PAGES.communities,
  },
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    url: BASE_URL + PAGES.communities,
    title: "Communities | The Babcock Torch",
    description:
      "Discover campus organizations, clubs, and groups. Stay updated with their latest news, events, and announcements.",
    type: "website",
    siteName: "Communities | The Babcock Torch",
  },
  twitter: {
    title: "Communities | The Babcock Torch",
    description:
      "Discover campus organizations, clubs, and groups. Stay updated with their latest news, events, and announcements.",
    images: BASE_URL + IMAGES.logos.logo.src,
    card: "summary_large_image",
  },
};

const CommunitiesPage = async () => {
  const { data: communities } = await getCommunities();

  return <CommunitiesHome communities={communities || []} />;

  // return (
  //   <ComingSoon
  //     title="Communities"
  //     description="The Communities page is currently under construction. Please check back soon for updates."
  //     showReturnButton={true}
  //   />
  // );
};

export default CommunitiesPage;
