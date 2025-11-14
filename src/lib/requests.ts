import { groq } from "next-sanity";
import { API_ROUTES, BASE_URL, CREDENTIALS } from "./constants";
import { sanityClient } from "./sanity.client";
import { OpinionPreview, PostPreview } from "./types";

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
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    description,
    publishedAt,
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

    return postsData as PostPreview[];
  } catch (error) {
    console.error("Failed to fetch posts:", error);

    return [];
  }
};

export const getOpinions = async () => {
  const opinionsQuery = groq`
  *[_type == "opinion"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    author->{
      name
    }
  }
`;

  try {
    const opinionsData = await sanityClient.fetch(opinionsQuery);

    return opinionsData as OpinionPreview[];
  } catch (error) {
    console.error("Failed to fetch opinions:", error);

    return [];
  }
};

export const getWeather = async () => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${CREDENTIALS.weather_api_key}&q=Ilishan`
    );

    if (!response.ok) {
      return { temp: 0, condition: "" };
    }

    const data = await response.json();

    return {
      temp: data.current.temp_c,
      condition: data.current.condition.text,
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);

    return { temp: 0, condition: "" };
  }
};
