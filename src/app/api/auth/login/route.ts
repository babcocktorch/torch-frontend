import { NextResponse } from "next/server";
import { BACKEND_BASE_URL, BACKEND_API_ROUTES } from "@/lib/constants";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Forward to backend
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.auth.login,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    if (response.ok && data.data?.token) {
      // Set HttpOnly cookie
      const cookieStore = await cookies();
      cookieStore.set("torch-admin-token", data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 1 week
      });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
