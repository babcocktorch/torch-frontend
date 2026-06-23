import { redirect } from "next/navigation";
import { PAGES } from "@/lib/constants";

const ImpactStoryRedirectPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  redirect(PAGES.impactStory(slug));
};

export default ImpactStoryRedirectPage;
