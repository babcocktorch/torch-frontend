export const BASE_URL = "https://the-babcock-torch.vercel.app";
export const THEME_KEY = "the-babcock-torch-theme";

export const IMAGES = {
  logos: {
    big_moore_white: {
      src: "/logos/torch_logotype_big_moore_white.svg",
      width: 100,
      height: 100,
    },
    engravers_old_eng_white: {
      src: "/logos/torch_logotype_engravers_old_eng_white.svg",
      width: 100,
      height: 100,
    },
    engravers_old_eng_gold: {
      src: "/logos/torch_logotype_engravers_old_eng_gold.svg",
      width: 100,
      height: 100,
    },
    engravers_old_eng_black: {
      src: "/logos/torch_logotype_engravers_old_eng_black.svg",
      width: 100,
      height: 100,
    },
    big_moore_gold: {
      src: "/logos/torch_logotype_big_moore_gold.svg",
      width: 100,
      height: 100,
    },
    logo_white: {
      src: "/logos/torch_white.svg",
      width: 100,
      height: 100,
    },
    logo_gold: {
      src: "/logos/torch_gold.svg",
      width: 100,
      height: 100,
    },
  },
};

export const PAGES = {
  home: "/",
  post: (year: string, month: string, day: string, slug: string) =>
    `/post/${year}/${month}/${day}/${slug}`,
};

export const CREDENTIALS = {
  sanity_project_id: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  sanity_dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
};

export const MAJOR_CATEGORIES = [
  "News",
  "Breaking",
  "Opinions",
  "Blogs",
  "Communities",
  "Business",
  "Vendors",
  "Alumni",
  "Calendar",
  "Masthead",
];

export const MINOR_CATEGORIES = [
  "Top Stories",
  "Breaking",
  "Blogs",
  "Ask the Torch AI",
];
