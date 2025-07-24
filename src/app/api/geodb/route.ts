import { NextResponse } from "next/server";

export async function GET() {
    const apiUrl = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=CA&types=CITY&limit=10&sort=-population";

    const headers = {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY as string,
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
    };

    try {
        const res = await fetch(apiUrl, {
            method: "GET",
            headers,
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch cities" }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Server error", detail: error }, { status: 500 });
    }
}
