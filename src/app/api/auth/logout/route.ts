import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("torch-admin-token");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
};
