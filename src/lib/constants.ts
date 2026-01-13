import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://torch-frontend.vercel.app";

export const BACKEND_BASE_URL = "https://torch-backend.vercel.app";

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
    logo: {
      src: "/logos/logo.png",
      width: 3290,
      height: 3290,
    },
  },
  contributor_cta: {
    src: "/images/contributor_cta.webp",
    width: 3264,
    height: 2448,
  },
};

export const PAGES = {
  home: "/",
  opinions: "/opinions",
  top_stories: "/top-stories",
  ask_the_torch_ai: "/ask-the-torch-ai",
  blogs: "/blogs",
  communities: "/communities",
  business: "/business",
  vendors: "/vendors",
  alumni: "/alumni",
  calendar: "/calendar",
  maps: "/maps",
  masthead: "/masthead",
  policy: "/policy",
  search: (query?: string) => "/search" + (query ? `?query=${query}` : ""),
  post: (slug: string) => `/p/${slug}`,
  author: (slug: string) => `/author/${slug}`,
};

export const CREDENTIALS = {
  sanity_project_id: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  sanity_dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",

  clickup_api_token: process.env.CLICKUP_API_TOKEN || "",
  clickup_list_id: process.env.CLICKUP_LIST_ID || "",

  weather_api_key: process.env.WEATHER_API_KEY || "",
};

export const MAJOR_CATEGORIES = [
  { name: "News", href: PAGES.home },
  { name: "Opinions", href: PAGES.opinions },
  // { name: "Blogs", href: PAGES.blogs },
  { name: "Communities", href: PAGES.communities },
  // { name: "Business", href: PAGES.business },
  // { name: "Vendors", href: PAGES.vendors },
  // { name: "Alumni", href: PAGES.alumni },
  // { name: "Calendar", href: PAGES.calendar },
  // { name: "Maps", href: PAGES.maps },
  { name: "Masthead", href: PAGES.masthead },
  { name: "Torch AI", href: PAGES.ask_the_torch_ai },
];

export const MINOR_CATEGORIES = [
  { name: "Top Stories", href: PAGES.top_stories },
  { name: "Blogs", href: PAGES.blogs },
  { name: "Ask the Torch AI", href: PAGES.ask_the_torch_ai },
];

export const API_ROUTES = {
  submit_idea: "/api/submit-idea",
  weather: "/api/weather",
};

export const ADMIN_PAGES = {
  login: "/admin/login",
  setup: "/admin/setup",
  dashboard: "/admin",
  articles: "/admin/articles",
};

export const BACKEND_API_ROUTES = {
  // Auth endpoints
  auth: {
    setup: "/admin/auth/setup",
    login: "/admin/auth/login",
    me: "/admin/auth/me",
    logout: "/admin/auth/logout",
  },
  // Admin article endpoints
  admin: {
    syncArticles: "/admin/articles/sync",
    articles: "/admin/articles",
    articleVisibility: (id: string) => `/admin/articles/${id}/visibility`,
    editorsPick: (id: string) => `/admin/articles/${id}/editors-pick`,
  },
  // Public article endpoints
  public: {
    articles: "/articles",
    article: (slug: string) => `/articles/${slug}`,
  },
};

export const SOCIAL_MEDIA = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61583489604023",
    icon: FaFacebook,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/babcocktorch",
    icon: FaInstagram,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/the-babcock-torch",
    icon: FaLinkedin,
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@babcocktorch",
    icon: FaTiktok,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@babcocktorch",
    icon: FaYoutube,
  },
  {
    name: "X",
    url: "https://x.com/babcocktorch",
    icon: FaXTwitter,
  },
];

// Torch AI Chat Configuration
export const TORCH_AI = {
  endpoint: "https://santacl-bkg.hf.space/chat",
  default_user_id: "torch-ai-guest",
  default_profile: {
    name: "Torch AI User",
    level: "Guest",
    program: "General",
    hall: "N/A",
  },
  default_persona: "default",
};
