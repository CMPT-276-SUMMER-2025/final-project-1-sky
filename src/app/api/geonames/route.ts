// src/app/api/geonames/route.ts
import { NextResponse } from "next/server";
import { fetchCityInfo } from "@/services/geonamesService";

/**
 * GeoNames API Route (/api/geonames)
 * 
 * Next.js API endpoint for retrieving city details from GeoNames.
 * Accepts a `city` query parameter and returns structured
 * information (population, country, lat/lon, etc.).
 * 
 * Uses `geonamesService.ts` to interact with the GeoNames API.
 * Handles error responses and ensures consistent output format.
 */

export async function GET(req: Request) {
  const url = new URL(req.url);
  const city = url.searchParams.get("city");
  const username = process.env.GEONAMES_USERNAME;

  // Input validation
  if (!city) {
    return NextResponse.json(
      { error: "Missing city parameter" },
      { status: 400 }
    );
  }
  if (!username) {
    return NextResponse.json(
      { error: "GeoNames username is missing" },
      { status: 500 }
    );
  }

  try {
    const data = await fetchCityInfo(city, username);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unknown error occurred";

    const status = message.includes("not found")
      ? 404
      : message.includes("Missing")
      ? 400
      : 500;

    return NextResponse.json({ error: message }, { status });
  }
}