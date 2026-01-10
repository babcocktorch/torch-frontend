import { BASE_URL, IMAGES, PAGES } from "@/lib/constants";
import { Metadata } from "next";
import TorchAIPageContent from "./content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ask the Torch AI | The Babcock Torch",
  metadataBase: new URL(BASE_URL),
  description:
    "Ask the Torch AI is a tool that allows you to ask questions about the Babcock Torch.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    images: BASE_URL + IMAGES.logos.logo.src,
    url: BASE_URL + PAGES.ask_the_torch_ai,
    title: "Ask the Torch AI | The Babcock Torch",
    description:
      "Ask the Torch AI is a tool that allows you to ask questions about the Babcock Torch.",
    type: "website",
    siteName: "Ask the Torch AI | The Babcock Torch",
  },
  twitter: {
    title: "Ask the Torch AI | The Babcock Torch",
    description:
      "Ask the Torch AI is a tool that allows you to ask questions about the Babcock Torch.",
    images: BASE_URL + IMAGES.logos.logo.src,
    card: "summary_large_image",
  },
};

const AskTheTorchAIPage = () => {
  return <TorchAIPageContent />;
};

export default AskTheTorchAIPage;
