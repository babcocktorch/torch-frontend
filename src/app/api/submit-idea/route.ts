import { CREDENTIALS } from "@/lib/constants";
import { NextResponse, type NextRequest } from "next/server";

// In-memory rate limiting (per server instance)
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 1000;

export const POST = async (request: NextRequest) => {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const rateData = rateLimit.get(ip);

    if (rateData) {
      if (now - rateData.timestamp < WINDOW_MS) {
        if (rateData.count >= MAX_REQUESTS) {
          return NextResponse.json(
            { message: "Too many requests. Please try again later." },
            { status: 429 },
          );
        }
        rateData.count++;
      } else {
        rateLimit.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const idea = formData.get("idea") as string;
    const attachment = formData.get("attachment") as File | null;

    if (!name || !email || !idea) {
      return NextResponse.json(
        { message: "Name, email, and idea are required." },
        { status: 400 },
      );
    }

    if (attachment) {
      if (attachment.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Attachment must be less than 5MB." },
          { status: 400 },
        );
      }
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(attachment.type)) {
        return NextResponse.json(
          {
            message:
              "Invalid file type. Only images and documents are allowed.",
          },
          { status: 400 },
        );
      }
    }

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
        `ClickUp API Error: ${errorData.err || taskResponse.statusText}`,
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
      { status: 200 },
    );
  } catch (error) {
    console.error("Internal Server Error:", error);

    return NextResponse.json(
      { message: "Error submitting form.", error: (error as Error).message },
      { status: 500 },
    );
  }
};
