import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const url = new URL(request.url);
    const city = url.searchParams.get("city");
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");


    const apiKey = process.env.OPENWEATHER_API_KEY;

    let apiUrl: string;
    
    if (city) {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    } else {
        apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    }

    try {
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return NextResponse.json(
            { 
            error: "Failed to fetch weather data",
            details: errorData?.message || `HTTP ${res.status}`
            },
            { status: res.status }
        );
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Weather API Error:", error);
        return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
        );
    }
}