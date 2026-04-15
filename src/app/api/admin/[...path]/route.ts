import { NextRequest, NextResponse } from "next/server";
import { BACKEND_BASE_URL } from "@/lib/constants";
import { cookies } from "next/headers";

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await params;
    const pathString = path.join("/");

    const cookieStore = await cookies();
    const token = cookieStore.get("torch-admin-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { search } = request.nextUrl;
    const backendUrl = `${BACKEND_BASE_URL}/api/v2/admin/${pathString}${search}`;

    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${token}`);

    // Remove headers that might cause issues for fetch proxy
    headers.delete("host");
    headers.delete("cookie");
    headers.delete("content-length");
    headers.delete("connection");

    const reqBody =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.text()
        : undefined;

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: reqBody,
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return new NextResponse(
      typeof data === "string" ? data : JSON.stringify(data),
      {
        status: response.status,
        headers: {
          "Content-Type": contentType || "application/json",
        },
      },
    );
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
