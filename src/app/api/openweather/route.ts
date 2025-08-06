import { NextResponse } from "next/server";
import { fetchOpenWeatherData } from "@/services/openweatherService";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get("city");
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");
    const apiKey = process.env.OPENWEATHER_API_KEY!;
    const data = await fetchOpenWeatherData(city, lat, lon, apiKey);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "internal server error" }, { status: 400 });
  }
}
