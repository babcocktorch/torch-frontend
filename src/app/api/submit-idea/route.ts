import { CREDENTIALS } from "@/lib/constants";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const idea = formData.get("idea") as string;
    const attachment = formData.get("attachment") as File | null;

    const clickUpToken = CREDENTIALS.clickup_api_token;
    const clickUpListId = CREDENTIALS.clickup_list_id;

    const createTaskUrl = `https://api.clickup.com/api/v2/list/${clickUpListId}/task`;

    const taskData = {
      name: "New Article Idea",
      description: `Submitted by: ${name} (${email})\n\n--- IDEA ---\n${idea}`,
    };

    const taskResponse = await fetch(createTaskUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: clickUpToken,
      },
      body: JSON.stringify(taskData),
    });

    if (!taskResponse.ok) {
      const errorData = await taskResponse.json();
      console.error("ClickUp API Error (Task Creation):", errorData);
      throw new Error(
        `ClickUp API Error: ${errorData.err || taskResponse.statusText}`
      );
    }

    const task = await taskResponse.json();

    if (attachment) {
      const attachmentUrl = `https://api.clickup.com/api/v2/task/${task.id}/attachment`;
      const attachmentFormData = new FormData();
      attachmentFormData.append("attachment", attachment);

      const attachmentResponse = await fetch(attachmentUrl, {
        method: "POST",
        headers: {
          Authorization: clickUpToken,
        },
        body: attachmentFormData,
      });

      if (!attachmentResponse.ok) {
        const errorData = await attachmentResponse.json();
        console.error("ClickUp API Error (Attachment):", errorData);
        // Continue even if attachment fails, as the task is already created.
        // You might want to handle this differently, e.g., by deleting the task or logging the failure.
      }
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
