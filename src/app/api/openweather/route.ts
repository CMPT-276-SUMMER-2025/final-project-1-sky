import { NextResponse } from "next/server";
import { fetchOpenWeatherData } from "@/services/openweatherService";

/**
 * OpenWeather API Route (/api/openweather)
 * 
 * Next.js API endpoint for retrieving weather data from OpenWeatherMap.
 * Accepts `city` (or `lat`/`lon`) query parameters and returns:
 *  - Current weather
 *  - 5-day forecast
 *  - 7-day historical weather
 *  - Air quality index (AQHI)
 * 
 * Uses `openweatherService.ts` to fetch and process data.
 * Handles errors gracefully and outputs a standardized JSON response.
 */


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
