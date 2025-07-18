import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Basic validation on page param
  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: "Invalid page parameter" }, { status: 400 });
  }

  const headers = {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY as string,
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  };

  const apiUrl = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=CA&limit=${limit}&offset=${offset}&sort=-population`;

  const res = await fetch(apiUrl, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch cities" }, { status: res.status });
  }

  const data = await res.json();

  return NextResponse.json(data);
}
