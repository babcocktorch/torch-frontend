import { API_ROUTES, BASE_URL } from "./constants";

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
