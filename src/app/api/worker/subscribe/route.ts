import { resend } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

const handler = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { email } = body;

    // Check if the email address exists
    const { data, error: contactFetchError } = await resend.contacts.get({
      email,
    });

    if (
      contactFetchError &&
      contactFetchError.message !== "Contact not found"
    ) {
      return NextResponse.json(
        { error: "Failed to subcribe to The Torch" },
        { status: 500 },
      );
    }

    if (data?.id) {
      return NextResponse.json({ error: "Email exists" }, { status: 409 });
    }

    const segmentId = "3b2351b7-6bb0-4476-b94d-748999f02cf7";

    const { error: contactCreationError } = await resend.contacts.create({
      email,
      unsubscribed: false,
    });

    if (contactCreationError) {
      return NextResponse.json(
        { error: "Failed to subcribe to The Torch" },
        { status: 500 },
      );
    }

    const { error: addToSegmentError } = await resend.contacts.segments.add({
      email,
      segmentId,
    });

    if (addToSegmentError) {
      return NextResponse.json(
        { error: "Failed to subcribe to The Torch" },
        { status: 500 },
      );
    }

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to subscribe to The Torch:", error);

    return NextResponse.json(
      { error: "Failed to subcribe to The Torch" },
      { status: 500 },
    );
  }
};

export const POST = verifySignatureAppRouter(handler);
