import { groq } from "next-sanity";
import { API_ROUTES, BASE_URL, CREDENTIALS } from "./constants";
import { sanityClient } from "./sanity.client";
import { AuthorType, PostType } from "./types";

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

export const getPosts = async () => {
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
    const postsData = await sanityClient.fetch(postsQuery);

    return postsData as PostType[];
  } catch (error) {
    console.error("Failed to fetch posts:", error);

    return [];
  }
};

export const getOpinions = async () => {
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
    const opinionsData = await sanityClient.fetch(opinionsQuery);

    return opinionsData as PostType[];
  } catch (error) {
    console.error("Failed to fetch opinions:", error);

    return [];
  }
};

export const searchPosts = async (searchTerm: string) => {
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
    const searchResults = await sanityClient.fetch(searchQuery, {
      searchTerm: `*${searchTerm}*`,
    });

    return searchResults as PostType[];
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
