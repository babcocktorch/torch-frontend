import { groq } from "next-sanity";
import { API_ROUTES, BASE_URL } from "./constants";
import { sanityClient } from "./sanity.client";
import { PostPreview } from "./types";

export const submitIdea = async (details: {
  name: string;
  email: string;
  idea: string;
}) => {
  try {
    const response = await fetch(BASE_URL + API_ROUTES.submit_idea, {
      method: "POST",
      body: JSON.stringify(details),
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
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    description,
    publishedAt,
    author->{
      name
    }
  }
`;

  try {
    const postsData = await sanityClient.fetch(postsQuery);

    return postsData as PostPreview[];
  } catch (error) {
    console.error("Failed to fetch posts:", error);

    return [];
  }
};
