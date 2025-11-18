import { NextResponse } from "next/server";
import { CREDENTIALS } from "@/lib/constants";

export const GET = async () => {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${CREDENTIALS.weather_api_key}&q=Ilishan`,
      {
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ temp: 0, condition: "" });
    }

    const data = await response.json();

    return NextResponse.json({
      temp: data.current.temp_c,
      condition: data.current.condition.text,
    });
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return NextResponse.json({ temp: 0, condition: "" });
  }
};
