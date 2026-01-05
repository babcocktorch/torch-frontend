import { PortableTextBlock } from "next-sanity";

export type AuthorType = {
  _id: string;
  name: string;
  slug: string;
  image?: any;
  bio?: PortableTextBlock[];
};

export type PostType = {
  _id: string;
  title: string;
  slug: string;
  mainImage: any;
  description: string;
  date: string;
  isPublished: boolean;
  featured: boolean;
  isPost: boolean;
  author: {
    name: string;
    slug?: string;
    image?: any;
  };
  categories: {
    title: string;
  }[];
  body: PortableTextBlock[];
};

export type PostProps = {
  post: PostType;
};

export type ColorScheme = {
  backgroundColor: string;
  textColor: string;
};

export type SharePostProps = {
  title: string;
  slug: string;
  description: string;
  date: string;
};

export type ComingSoonProps = {
  title?: string;
  description?: string;
  showReturnButton?: boolean;
};

export type OpinionAuthor = {
  name: string;
  slug: string | null;
  opinionCount: number;
};

// Admin types
export type AdminUser = {
  id: string;
  email: string;
  name: string;
};

export type AdminArticle = {
  id: string;
  sanityId: string;
  title: string;
  slug: string;
  author: string;
  type: string;
  isPost: boolean;
  visibility: "public" | "private";
  isEditorsPick: boolean;
  lastSyncedAt: string;
  createdAt?: string;
};

export type AuthResponse = {
  success: boolean;
  data: {
    token: string;
    admin: AdminUser;
  };
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type SyncResult = {
  message: string;
  created: number;
  updated: number;
  total: number;
};
