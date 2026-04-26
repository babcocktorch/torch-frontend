import { groq } from "next-sanity";
import {
  API_ROUTES,
  BACKEND_API_ROUTES,
  BACKEND_BASE_URL,
  BASE_URL,
} from "./constants";
import { sanityClient } from "./sanity.client";
import {
  AuthorType,
  Community,
  CommunitySubmission,
  CreateSubmissionRequest,
  ImpactStoryType,
  OpinionAuthor,
  PostType,
} from "./types";

export const submitIdea = async (details: FormData) => {
  try {
    const response = await fetch(BASE_URL + API_ROUTES.submit_idea, {
      method: "POST",
      body: details,
    });

    if (!response.ok) {
      throw new Error("Failed to submit idea. Please try again.");
    }

    return { data: await response.json() };
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit idea. Please try again." };
  }
};

/**
 * Fetch public articles from backend to get visibility info
 */
const fetchBackendPublicArticles = async (): Promise<{
  publicSlugs: Set<string>;
  editorsPickSlugs: string[];
  featuredOpinionSlug: string | null;
  readCounts: Record<string, number>;
}> => {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.articlesSort,
      { next: { revalidate: 60 } }, // Cache for 60 seconds
    );

    if (!response.ok) {
      console.error("Failed to fetch backend articles");
      return {
        publicSlugs: new Set(),
        editorsPickSlugs: [],
        featuredOpinionSlug: null,
        readCounts: {},
      };
    }

    const data = await response.json();
    const articles = (data.data?.articles as any[]) || [];

    const publicSlugs = new Set<string>();
    const readCounts: Record<string, number> = {};

    articles.forEach((a) => {
      publicSlugs.add(a.slug);
      readCounts[a.slug] = a.readCount || 0;
    });

    // Get all editor's picks, sorted by creation date descending (newest first)
    const editorsPicks = articles
      .filter((a) => a.isEditorsPick)
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.lastSyncedAt).getTime() -
          new Date(a.createdAt || a.lastSyncedAt).getTime(),
      )
      .map((a) => a.slug);

    const featuredOpinion = articles.find((a) => a.isFeaturedOpinion);

    return {
      publicSlugs,
      editorsPickSlugs: editorsPicks,
      featuredOpinionSlug: featuredOpinion?.slug || null,
      readCounts,
    };
  } catch (error) {
    console.error("Failed to fetch backend articles:", error);
    return {
      publicSlugs: new Set(),
      editorsPickSlugs: [],
      featuredOpinionSlug: null,
      readCounts: {},
    };
  }
};

/**
 * Check if a single article is public via backend
 */
export const isArticlePublic = async (slug: string): Promise<boolean> => {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.article(slug),
      { next: { revalidate: 60 } },
    );
    return response.ok;
  } catch (error) {
    console.error("Failed to check article visibility:", error);
    return false;
  }
};

export const getPosts = async (): Promise<{
  posts: PostType[];
  editorsPickSlugs: string[];
}> => {
  const postsQuery = groq`
  *[_type == "Post" && isPublished == true] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    description,
    date,
    isPublished,
    featured,
    isPost,
    categories[]->{
      title,
      "slug": slug.current
    },
    author->{
      name
    }
  }
`;

  try {
    // Fetch both Sanity posts and backend visibility info in parallel
    const [postsData, backendInfo] = await Promise.all([
      sanityClient.fetch(postsQuery),
      fetchBackendPublicArticles(),
    ]);

    const allPosts = postsData as PostType[];

    // Filter posts to only include those that are public in backend
    const filteredPosts = allPosts.filter((post) =>
      backendInfo.publicSlugs.has(post.slug),
    );

    return {
      posts: filteredPosts,
      editorsPickSlugs: backendInfo.editorsPickSlugs,
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { posts: [], editorsPickSlugs: [] };
  }
};

export const getOpinions = async (): Promise<{
  opinions: PostType[];
  featuredOpinionSlug: string | null;
}> => {
  const opinionsQuery = groq`
  *[_type == "Post" && isPublished == true && (isPost == false || !defined(isPost))] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    description,
    date,
    isPublished,
    featured,
    isPost,
    categories[]->{
      title,
      "slug": slug.current
    },
    author->{
      name
    }
  }
`;

  try {
    // Fetch both Sanity opinions and backend visibility info in parallel
    const [opinionsData, backendInfo] = await Promise.all([
      sanityClient.fetch(opinionsQuery),
      fetchBackendPublicArticles(),
    ]);

    const allOpinions = opinionsData as PostType[];

    // Filter opinions to only include those that are public in backend, then populate read count
    const filteredOpinions = allOpinions
      .filter((opinion) => backendInfo.publicSlugs.has(opinion.slug))
      .map((opinion) => ({
        ...opinion,
        readCount: backendInfo.readCounts[opinion.slug] || 0,
      }));

    return {
      opinions: filteredOpinions,
      featuredOpinionSlug: backendInfo.featuredOpinionSlug,
    };
  } catch (error) {
    console.error("Failed to fetch opinions:", error);
    return { opinions: [], featuredOpinionSlug: null };
  }
};

export const searchPosts = async (searchTerm: string): Promise<PostType[]> => {
  if (!searchTerm || searchTerm.trim() === "") {
    return [];
  }

  const searchQuery = groq`
  *[_type == "Post" && isPublished == true && (
    title match $searchTerm ||
    description match $searchTerm
  )] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    description,
    date,
    isPublished,
    featured,
    isPost,
    categories[]->{
      title,
      "slug": slug.current
    },
    author->{
      name
    }
  }
`;

  try {
    // Fetch both search results and backend visibility info in parallel
    const [searchResults, backendInfo] = await Promise.all([
      sanityClient.fetch(searchQuery, {
        searchTerm: `*${searchTerm}*`,
      }),
      fetchBackendPublicArticles(),
    ]);

    const allResults = searchResults as PostType[];

    // Filter results to only include those that are public in backend
    const filteredResults = allResults.filter((post) =>
      backendInfo.publicSlugs.has(post.slug),
    );

    return filteredResults;
  } catch (error) {
    console.error("Failed to search posts:", error);

    return [];
  }
};

export const getPostsByTag = async (tagSlug: string): Promise<PostType[]> => {
  // Query posts where one of the category slugs (lowercase, hyphenated title) matches the tagSlug
  const tagQuery = groq`
  *[_type == "Post" && isPublished == true && $tagSlug in categories[]->slug.current] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    description,
    date,
    isPublished,
    featured,
    isPost,
    categories[]->{
      title,
      "slug": slug.current
    },
    author->{
      name
    }
  }
`;

  try {
    const [postsData, backendInfo] = await Promise.all([
      sanityClient.fetch(tagQuery, { tagSlug }),
      fetchBackendPublicArticles(),
    ]);

    const allPosts = postsData as PostType[];

    // Filter results to only include those that are public in backend
    const filteredResults = allPosts.filter((post) => {
      return backendInfo.publicSlugs.has(post.slug);
    });

    return filteredResults;
  } catch (error) {
    console.error("Failed to fetch posts by tag:", error);
    return [];
  }
};

export const getAuthor = async (slug: string) => {
  const authorQuery = groq`
  *[_type == "Author" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    image,
    bio
  }
`;

  try {
    const authorData = await sanityClient.fetch(authorQuery, { slug });

    return authorData as AuthorType;
  } catch (error) {
    console.error("Failed to fetch author:", error);

    return null;
  }
};

/**
 * Get all authors from Sanity (for sitemap generation)
 * Only returns authors that have slugs defined.
 */
export const getAllAuthors = async (): Promise<AuthorType[]> => {
  const allAuthorsQuery = groq`
  *[_type == "Author" && defined(slug.current)] {
    _id,
    name,
    "slug": slug.current,
    image
  }
`;

  try {
    const authors = await sanityClient.fetch(allAuthorsQuery);
    return authors as AuthorType[];
  } catch (error) {
    console.error("Failed to fetch all authors:", error);
    return [];
  }
};

export const getAuthorPosts = async (authorName: string) => {
  const authorPostsQuery = groq`
  *[_type == "Post" && isPublished == true && author->name == $authorName] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    description,
    date,
    isPublished,
    featured,
    isPost,
    categories[]->{
      title
    },
    author->{
      name,
      "slug": slug.current
    }
  }
`;

  try {
    const postsData = await sanityClient.fetch(authorPostsQuery, {
      authorName,
    });

    return postsData as PostType[];
  } catch (error) {
    console.error("Failed to fetch author posts:", error);

    return [];
  }
};

export const getWeather = async () => {
  try {
    const response = await fetch(BASE_URL + API_ROUTES.weather);

    if (!response.ok) {
      return { temp: 0, condition: "" };
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch weather:", error);

    return { temp: 0, condition: "" };
  }
};

export const getOpinionAuthors = async (): Promise<OpinionAuthor[]> => {
  // Get all opinions and extract unique authors with their opinion counts
  const { opinions } = await getOpinions();

  const authorMap = new Map<string, OpinionAuthor>();

  for (const opinion of opinions) {
    const authorName = opinion.author.name;
    const existing = authorMap.get(authorName);

    if (existing) {
      existing.opinionCount += 1;
    } else {
      authorMap.set(authorName, {
        name: authorName,
        slug: opinion.author.slug || null,
        opinionCount: 1,
      });
    }
  }

  // Sort by opinion count (descending)
  return Array.from(authorMap.values()).sort(
    (a, b) => b.opinionCount - a.opinionCount,
  );
};

// Torch AI Chat (legacy JSON body from older deployments)
export interface TorchAIAPIResponse {
  response: string;
  tool_used: string;
  vibe: string;
}

export type TorchAIPersona = "default" | "authoritative";

export type TorchAISseEvent =
  | { type: "thinking"; text: string }
  | { type: "thought_end" }
  | { type: "content"; text: string };

export interface StreamTorchAIMessageParams {
  message: string;
  webSearch: boolean;
  /** Skips extended reasoning for speed; less precise answers. Sent as `fast_mode`. */
  fastMode: boolean;
  persona: TorchAIPersona;
  signal?: AbortSignal;
  onEvent: (event: TorchAISseEvent) => void;
}

async function parseTorchAISseStream(
  response: Response,
  onEvent: (event: TorchAISseEvent) => void,
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  const handleLine = (raw: string) => {
    const line = raw.replace(/\r$/, "");
    if (!line.startsWith("data: ")) return;
    const payload = line.slice(6).trim();
    if (!payload || payload === "[DONE]") return;
    try {
      const data = JSON.parse(payload) as { type?: string; text?: string };
      const t = data.type;
      if (t === "thinking") {
        onEvent({ type: "thinking", text: data.text ?? "" });
      } else if (t === "thought_end") {
        onEvent({ type: "thought_end" });
      } else if (t === "content") {
        onEvent({ type: "content", text: data.text ?? "" });
      }
    } catch {
      // ignore malformed SSE payloads
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      handleLine(line);
    }
  }

  if (buffer.trim()) {
    for (const line of buffer.split("\n")) {
      handleLine(line);
    }
  }
}

async function readTorchAiError(response: Response): Promise<string> {
  try {
    const text = await response.text();
    const parsed = JSON.parse(text) as {
      detail?: Array<{ msg?: string }>;
      message?: string;
    };
    if (Array.isArray(parsed.detail) && parsed.detail[0]?.msg) {
      return parsed.detail[0].msg;
    }
    if (parsed.message) return parsed.message;
    return text || "Request failed.";
  } catch {
    return "Failed to get response. Please try again.";
  }
}

/**
 * Streams Torch AI chat via the local `/api/torch-ai` proxy, which derives
 * a stable user_id from the caller's IP. Handles SSE (`text/event-stream`)
 * or falls back to a single JSON body for legacy backends.
 */
export async function streamTorchAIMessage(
  params: StreamTorchAIMessageParams,
): Promise<{ error?: string }> {
  const { message, webSearch, fastMode, persona, signal, onEvent } = params;

  try {
    const response = await fetch(API_ROUTES.torch_ai, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        web_search: webSearch,
        fast_mode: fastMode,
        persona,
      }),
      signal,
    });

    if (!response.ok) {
      if (response.status === 422) {
        const err = await readTorchAiError(response);
        return { error: err };
      }
      return { error: "Failed to get response. Please try again." };
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      const text = await response.text();
      const data = JSON.parse(text) as TorchAIAPIResponse;
      if (data.response) {
        onEvent({ type: "content", text: data.response });
      }
      return {};
    }

    await parseTorchAISseStream(response, onEvent);
    return {};
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {};
    }
    console.error("Torch AI chat error:", error);
    return { error: "Failed to connect to Torch AI. Please try again." };
  }
}

// ============================================
// Community Public Functions
// ============================================

/**
 * Get all communities (public - for dropdown selection)
 */
export const getCommunities = async (): Promise<{
  data?: Community[];
  error?: string;
}> => {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.communities,
      { next: { revalidate: 60 } },
    );

    if (!response.ok) {
      return { error: "Failed to fetch communities" };
    }

    const result = await response.json();
    return { data: result.data?.communities || [] };
  } catch (error) {
    console.error("Failed to fetch communities:", error);
    return { error: "Network error. Please try again." };
  }
};

/**
 * Get a single community by slug (public)
 */
export const getCommunityBySlug = async (
  slug: string,
): Promise<{ data?: Community; error?: string }> => {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.community(slug),
      { next: { revalidate: 60 } },
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Community not found" };
      }
      return { error: "Failed to fetch community" };
    }

    const result = await response.json();
    return { data: result.data?.community };
  } catch (error) {
    console.error("Failed to fetch community:", error);
    return { error: "Network error. Please try again." };
  }
};

/**
 * Submit community content (public - no auth required)
 */
export const submitCommunityContent = async (
  submission: CreateSubmissionRequest,
): Promise<{ data?: CommunitySubmission; error?: string }> => {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.submissions.community,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submission),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        error: result.message || "Failed to submit content. Please try again.",
      };
    }

    return { data: result.data?.submission };
  } catch (error) {
    console.error("Failed to submit community content:", error);
    return { error: "Network error. Please try again." };
  }
};

// ============================================
// Article Read Tracking & Reactions
// ============================================

import {
  MastheadGuard,
  MastheadMember,
  ReactionsData,
  ReactionType,
} from "./types";

/**
 * Track an article read (fire-and-forget, silent)
 */
export const trackArticleRead = async (slug: string): Promise<void> => {
  try {
    await fetch(BACKEND_BASE_URL + BACKEND_API_ROUTES.public.trackRead(slug), {
      method: "POST",
    });
  } catch {
    // Silently fail — read tracking should never impact UX
  }
};

/**
 * Get reaction counts and user's current reaction for an article
 */
export const getArticleReactions = async (
  slug: string,
): Promise<ReactionsData> => {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.reactions(slug),
    );

    if (!response.ok) {
      return {
        reactions: { upvote: 0, downvote: 0 },
        total: 0,
        userReaction: null,
      };
    }

    const result = await response.json();
    return result.data as ReactionsData;
  } catch {
    return {
      reactions: { upvote: 0, downvote: 0 },
      total: 0,
      userReaction: null,
    };
  }
};

/**
 * Submit or update a reaction on an article
 */
export const submitReaction = async (
  slug: string,
  reactionType: ReactionType,
): Promise<ReactionsData | null> => {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.react(slug),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionType }),
      },
    );

    if (!response.ok) return null;

    const result = await response.json();
    return result.data as ReactionsData;
  } catch {
    return null;
  }
};

/**
 * Remove user's reaction from an article
 */
export const removeReaction = async (
  slug: string,
): Promise<ReactionsData | null> => {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.react(slug),
      { method: "DELETE" },
    );

    if (!response.ok) return null;

    const result = await response.json();
    return result.data as ReactionsData;
  } catch {
    return null;
  }
};

// ============================================
// Masthead Functions
// ============================================

/**
 * Get all masthead guards (eras/terms) from Sanity
 */
export const getMastheadGuards = async (): Promise<MastheadGuard[]> => {
  const guardsQuery = groq`
  *[_type == "mastheadGuard"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    label,
    administration,
    tenure,
    editorNote,
    editorImage,
    order
  }
`;

  try {
    const guards = await sanityClient.fetch(guardsQuery);
    return guards as MastheadGuard[];
  } catch (error) {
    console.error("Failed to fetch masthead guards:", error);
    return [];
  }
};

/**
 * Get all masthead members from Sanity
 */
export const getMastheadMembers = async (): Promise<MastheadMember[]> => {
  const mastheadQuery = groq`
  *[_type == "Masthead"] | order(order asc) {
    _id,
    name,
    position,
    image,
    board,
    "guard": guard->slug.current,
    order,
    graduationYear,
    quote,
    xUrl,
    linkedinUrl
  }
`;

  try {
    const members = await sanityClient.fetch(mastheadQuery);
    return members as MastheadMember[];
  } catch (error) {
    console.error("Failed to fetch masthead members:", error);
    return [];
  }
};

// ============================================
// Impact Stories Functions
// ============================================

const IMPACT_STORY_PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  description,
  communitySlug,
  communityName,
  date,
  mainImage,
  author->{
    name,
    "slug": slug.current,
    image
  },
  body,
  isPublished,
  featured
}`;

/**
 * Get all published impact stories, ordered by date descending.
 * Featured stories appear first.
 */
export const getImpactStories = async (): Promise<ImpactStoryType[]> => {
  const query = groq`
  *[_type == "impactStory" && isPublished == true] | order(featured desc, date desc) ${IMPACT_STORY_PROJECTION}
`;

  try {
    const stories = await sanityClient.fetch(query);
    return stories as ImpactStoryType[];
  } catch (error) {
    console.error("Failed to fetch impact stories:", error);
    return [];
  }
};

/**
 * Get published impact stories for a specific community.
 */
export const getImpactStoriesByCommunity = async (
  communitySlug: string,
): Promise<ImpactStoryType[]> => {
  const query = groq`
  *[_type == "impactStory" && isPublished == true && communitySlug == $communitySlug] | order(featured desc, date desc) ${IMPACT_STORY_PROJECTION}
`;

  try {
    const stories = await sanityClient.fetch(query, { communitySlug });
    return stories as ImpactStoryType[];
  } catch (error) {
    console.error(
      `Failed to fetch impact stories for community ${communitySlug}:`,
      error,
    );
    return [];
  }
};

/**
 * Get a single impact story by its slug.
 */
export const getImpactStory = async (
  slug: string,
): Promise<ImpactStoryType | null> => {
  const query = groq`
  *[_type == "impactStory" && slug.current == $slug][0] ${IMPACT_STORY_PROJECTION}
`;

  try {
    const story = await sanityClient.fetch(query, { slug });
    return story as ImpactStoryType | null;
  } catch (error) {
    console.error(`Failed to fetch impact story ${slug}:`, error);
    return null;
  }
};
