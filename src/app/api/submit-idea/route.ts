import { CREDENTIALS } from "@/lib/constants";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { name, email, idea } = body;

    const clickUpToken = CREDENTIALS.clickup_api_token;
    const clickUpListId = CREDENTIALS.clickup_list_id;

    const url = `https://api.clickup.com/api/v2/list/${clickUpListId}/task`;

    const taskData = {
      name: `New Article Idea: ${idea.substring(0, 50)}...`,
      description: `Submitted by: ${name} (${email})\n\n--- IDEA ---\n${idea}`,
      status: "Needs Review",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: clickUpToken,
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorData = await response.json();

      console.error("ClickUp API Error:", errorData);

      throw new Error(
        `ClickUp API Error: ${errorData.err || response.statusText}`
      );
    }

    return NextResponse.json(
      { message: "Submission successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Internal Server Error:", error);

    return NextResponse.json(
      { message: "Error submitting form.", error: (error as Error).message },
      { status: 500 }
    );
  }
};
