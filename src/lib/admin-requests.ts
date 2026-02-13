import { BACKEND_API_ROUTES, BACKEND_BASE_URL } from "./constants";
import {
  AdminArticle,
  Community,
  CommunitySubmission,
  CreateCommunityRequest,
  SubmissionStatus,
  SyncResult,
  UpdateCommunityRequest,
} from "./types";

/**
 * Helper for authenticated requests
 */
async function authFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {},
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(BACKEND_BASE_URL + endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || `Request failed with status ${response.status}`,
      };
    }

    return { data: data.data };
  } catch (error) {
    console.error("Request error:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Sync articles from Sanity CMS to database
 */
export async function syncArticles(token: string) {
  return authFetch<SyncResult>(BACKEND_API_ROUTES.admin.syncArticles, token, {
    method: "POST",
  });
}

/**
 * Get all articles (admin view)
 */
export async function getAdminArticles(token: string) {
  return authFetch<{ articles: AdminArticle[] }>(
    BACKEND_API_ROUTES.admin.articles,
    token,
  );
}

/**
 * Update article visibility
 */
export async function updateArticleVisibility(
  token: string,
  id: string,
  visibility: "public" | "private",
) {
  return authFetch<{ article: AdminArticle }>(
    BACKEND_API_ROUTES.admin.articleVisibility(id),
    token,
    {
      method: "PATCH",
      body: JSON.stringify({ visibility }),
    },
  );
}

/**
 * Set article as Editor's Pick
 */
export async function setEditorsPick(token: string, id: string) {
  return authFetch<{ message: string; article: AdminArticle }>(
    BACKEND_API_ROUTES.admin.editorsPick(id),
    token,
    {
      method: "POST",
    },
  );
}

/**
 * Remove article from Editor's Pick
 */
export async function removeEditorsPick(token: string, id: string) {
  return authFetch<{ message: string; article: AdminArticle }>(
    BACKEND_API_ROUTES.admin.editorsPick(id),
    token,
    {
      method: "DELETE",
    },
  );
}

/**
 * Set article as Featured Opinion
 */
export async function setFeaturedOpinion(token: string, id: string) {
  return authFetch<{ message: string; article: AdminArticle }>(
    BACKEND_API_ROUTES.admin.featuredOpinion(id),
    token,
    {
      method: "POST",
    },
  );
}

/**
 * Remove article from Featured Opinion
 */
export async function removeFeaturedOpinion(token: string, id: string) {
  return authFetch<{ message: string; article: AdminArticle }>(
    BACKEND_API_ROUTES.admin.featuredOpinion(id),
    token,
    {
      method: "DELETE",
    },
  );
}

/**
 * Get public articles (no auth required)
 */
export async function getPublicArticles() {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.articles,
    );
    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Failed to fetch articles" };
    }

    return { data: data.data as { articles: AdminArticle[] } };
  } catch (error) {
    console.error("Failed to fetch public articles:", error);
    return { error: "Network error. Please try again." };
  }
}

/**
 * Get a single public article by slug (no auth required)
 */
export async function getPublicArticle(slug: string) {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.article(slug),
    );
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        return { error: "Article not found" };
      }
      return { error: data.message || "Failed to fetch article" };
    }

    return { data: data.data as { article: AdminArticle } };
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return { error: "Network error. Please try again." };
  }
}

// ============================================
// Community Admin Functions
// ============================================

/**
 * Get all communities (admin view with metadata)
 */
export async function getAdminCommunities(token: string) {
  return authFetch<{ communities: Community[] }>(
    BACKEND_API_ROUTES.admin.communities,
    token,
  );
}

/**
 * Get a single community by ID (admin)
 */
export async function getAdminCommunity(token: string, id: string) {
  return authFetch<{ community: Community }>(
    BACKEND_API_ROUTES.admin.community(id),
    token,
  );
}

/**
 * Create a new community
 */
export async function createCommunity(
  token: string,
  data: CreateCommunityRequest,
) {
  return authFetch<{ message: string; community: Community }>(
    BACKEND_API_ROUTES.admin.communities,
    token,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

/**
 * Update a community
 */
export async function updateCommunity(
  token: string,
  id: string,
  data: UpdateCommunityRequest,
) {
  return authFetch<{ message: string; community: Community }>(
    BACKEND_API_ROUTES.admin.community(id),
    token,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
  );
}

/**
 * Delete a community
 */
export async function deleteCommunity(token: string, id: string) {
  return authFetch<{ message: string; deletedSubmissions: number }>(
    BACKEND_API_ROUTES.admin.community(id),
    token,
    {
      method: "DELETE",
    },
  );
}

// ============================================
// Submission Admin Functions
// ============================================

export type SubmissionFilters = {
  community_id?: string;
  status?: SubmissionStatus;
  submission_type?: "news" | "event" | "announcement";
};

/**
 * Get all submissions with optional filters
 */
export async function getAdminSubmissions(
  token: string,
  filters?: SubmissionFilters,
) {
  let endpoint = BACKEND_API_ROUTES.admin.submissions;

  if (filters) {
    const params = new URLSearchParams();
    if (filters.community_id)
      params.append("community_id", filters.community_id);
    if (filters.status) params.append("status", filters.status);
    if (filters.submission_type)
      params.append("submission_type", filters.submission_type);

    const queryString = params.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
  }

  return authFetch<{
    submissions: CommunitySubmission[];
    filters: SubmissionFilters;
  }>(endpoint, token);
}

/**
 * Get a single submission by ID
 */
export async function getAdminSubmission(token: string, id: string) {
  return authFetch<{ submission: CommunitySubmission; type: string }>(
    BACKEND_API_ROUTES.admin.submission(id),
    token,
  );
}

/**
 * Update submission status (approve or reject)
 */
export async function updateSubmissionStatus(
  token: string,
  id: string,
  status: "reviewed" | "rejected",
) {
  return authFetch<{ message: string; submission: CommunitySubmission }>(
    BACKEND_API_ROUTES.admin.submissionStatus(id),
    token,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    },
  );
}

/**
 * Delete a submission
 */
export async function deleteSubmission(token: string, id: string) {
  return authFetch<{ message: string }>(
    BACKEND_API_ROUTES.admin.submission(id),
    token,
    {
      method: "DELETE",
    },
  );
}
