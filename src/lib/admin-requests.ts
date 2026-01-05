import { BACKEND_API_ROUTES, BACKEND_BASE_URL } from "./constants";
import { AdminArticle, SyncResult } from "./types";

/**
 * Helper for authenticated requests
 */
async function authFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
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
      return { error: data.message || `Request failed with status ${response.status}` };
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
    token
  );
}

/**
 * Update article visibility
 */
export async function updateArticleVisibility(
  token: string,
  id: string,
  visibility: "public" | "private"
) {
  return authFetch<{ article: AdminArticle }>(
    BACKEND_API_ROUTES.admin.articleVisibility(id),
    token,
    {
      method: "PATCH",
      body: JSON.stringify({ visibility }),
    }
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
    }
  );
}

/**
 * Get public articles (no auth required)
 */
export async function getPublicArticles() {
  try {
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.articles
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
      BACKEND_BASE_URL + BACKEND_API_ROUTES.public.article(slug)
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
