import { NextRequest } from "next/server";
import { TORCH_AI } from "@/lib/constants";

async function deriveUserId(request: NextRequest): Promise<string> {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const encoder = new TextEncoder();
  const data = encoder.encode(ip + ":torch-ai-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    message?: string;
    web_search?: boolean;
    fast_mode?: boolean;
    persona?: string;
  };

  const userId = await deriveUserId(request);

  const upstream = await fetch(TORCH_AI.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      message: body.message ?? "",
      web_search: body.web_search ?? false,
      fast: body.fast_mode ?? false,
      persona: body.persona ?? TORCH_AI.default_persona,
      profile: TORCH_AI.default_profile,
    }),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "application/json",
      },
    });
  }

  const contentType = upstream.headers.get("content-type") ?? "";

  if (contentType.includes("text/event-stream")) {
    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  const text = await upstream.text();
  return new Response(text, {
    headers: { "Content-Type": contentType || "application/json" },
  });
}
