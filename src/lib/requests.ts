import { groq } from "next-sanity";
import {
  API_ROUTES,
  BACKEND_API_ROUTES,
  BACKEND_BASE_URL,
  BASE_URL,
  TORCH_AI,
} from "./constants";
import { sanityClient } from "./sanity.client";
import {
  AdminArticle,
  AuthorType,
  Community,
  CommunitySubmission,
  CreateSubmissionRequest,
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
  editorsPickSlug: string | null;
}> => {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.articles,
      { next: { revalidate: 60 } }, // Cache for 60 seconds
    );

    if (!response.ok) {
      console.error("Failed to fetch backend articles");
      return { publicSlugs: new Set(), editorsPickSlug: null };
    }

    const data = await response.json();
    const articles = (data.data?.articles as AdminArticle[]) || [];

    const publicSlugs = new Set(articles.map((a) => a.slug));
    const editorsPick = articles.find((a) => a.isEditorsPick);

    return {
      publicSlugs,
      editorsPickSlug: editorsPick?.slug || null,
    };
  } catch (error) {
    console.error("Failed to fetch backend articles:", error);
    return { publicSlugs: new Set(), editorsPickSlug: null };
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
  editorsPickSlug: string | null;
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
      title
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
      editorsPickSlug: backendInfo.editorsPickSlug,
    };
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return { posts: [], editorsPickSlug: null };
  }
};

export const getOpinions = async (): Promise<PostType[]> => {
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
      title
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

    // Filter opinions to only include those that are public in backend
    const filteredOpinions = allOpinions.filter((opinion) =>
      backendInfo.publicSlugs.has(opinion.slug),
    );

    return filteredOpinions;
  } catch (error) {
    console.error("Failed to fetch opinions:", error);
    return [];
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
      title
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
  const opinions = await getOpinions();

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

// Torch AI Chat
export interface TorchAIAPIResponse {
  response: string;
  tool_used: string;
  vibe: string;
}

export interface TorchAIChatResponse {
  data?: TorchAIAPIResponse;
  error?: string;
}

export const sendTorchAIMessage = async (
  message: string,
  uniqueId: string,
): Promise<TorchAIChatResponse> => {
  try {
    const response = await fetch(TORCH_AI.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uniqueId,
        message: message,
        profile: TORCH_AI.default_profile,
        persona: TORCH_AI.default_persona,
      }),
    });

    if (!response.ok) {
      if (response.status === 422) {
        const errorData = await response.json();
        const errorMessage =
          errorData.detail?.[0]?.msg || "Invalid request. Please try again.";
        return { error: errorMessage };
      }
      return { error: "Failed to get response. Please try again." };
    }

    const text = await response.text();
    const data: TorchAIAPIResponse = JSON.parse(text);
    return { data };
  } catch (error) {
    console.error("Torch AI chat error:", error);
    return { error: "Failed to connect to Torch AI. Please try again." };
  }
};

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
// Masthead Functions
// ============================================

import { MastheadMember } from "./types";

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
    order
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
