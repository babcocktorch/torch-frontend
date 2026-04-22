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
    slug?: string;
  }[];
  body: PortableTextBlock[];
  readCount?: number;
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
  isFeaturedOpinion: boolean;
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

// Community types
export type Community = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerURL?: string | null;
  contactEmail?: string | null;
  category?: string | null;
  memberCount: number;
  openToJoin: boolean;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    submissions: number;
  };
};

export type SubmissionType = "news" | "event" | "announcement";
export type SubmissionStatus = "pending" | "reviewed" | "rejected";

export type CommunitySubmission = {
  id: string;
  communityId: string;
  authorName: string;
  authorContact: string;
  submissionType: SubmissionType;
  title: string;
  content: string;
  eventDate?: string | null;
  mediaUrls: string[] | string; // Can be array or JSON string from API
  status: SubmissionStatus;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  createdAt: string;
  community?: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
  };
};

// Request types for creating/updating
export type CreateCommunityRequest = {
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  contactEmail?: string;
  category?: string;
  openToJoin?: boolean;
  bannerURL?: string;
  memberCount?: number;
};

export type UpdateCommunityRequest = {
  name?: string;
  slug?: string;
  description?: string | null;
  logoUrl?: string | null;
  contactEmail?: string | null;
  category?: string | null;
  openToJoin?: boolean;
  bannerURL?: string | null;
  memberCount?: number;
};

export type CreateSubmissionRequest = {
  communityId: string;
  authorName: string;
  authorContact: string;
  submissionType: SubmissionType;
  title: string;
  content: string;
  eventDate?: string;
  mediaUrls?: string[];
};

// Masthead types
export type MastheadGuard = {
  _id: string;
  title: string;
  slug: string;
  label: string;
  administration: string;
  tenure: string;
  editorNote?: string;
  editorImage?: any;
  order: number;
};

export type MastheadMember = {
  _id: string;
  name: string;
  position: string;
  image?: any;
  board: string;
  guard: string; // guard slug
  order: number;
  graduationYear?: string;
  quote?: string;
  xUrl?: string;
  linkedinUrl?: string;
};

// Reaction types
export type ReactionType = "upvote" | "downvote";

export type ReactionsData = {
  reactions: { upvote: number; downvote: number };
  total: number;
  userReaction: ReactionType | null;
};

// Admin stats types
export type ArticleStats = {
  totalReads: number;
  uniqueReads: number;
  readsLast24h: number;
  readsLast7d: number;
  readsLast30d: number;
};

// Impact Story types
export type ImpactStoryType = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  communitySlug?: string;
  communityName?: string;
  date: string;
  mainImage?: any;
  author?: {
    name: string;
    slug?: string;
    image?: any;
  };
  body?: PortableTextBlock[];
  isPublished: boolean;
  featured: boolean;
};
