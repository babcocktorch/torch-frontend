import { NextResponse } from "next/server";
import { BACKEND_BASE_URL, BACKEND_API_ROUTES } from "@/lib/constants";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("torch-admin-token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Forward to backend
    const response = await fetch(
      BACKEND_BASE_URL + BACKEND_API_ROUTES.auth.me,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      // Token might be invalid, delete it
      cookieStore.delete("torch-admin-token");
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
