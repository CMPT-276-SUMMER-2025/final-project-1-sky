import { NextResponse } from "next/server";

export async function GET(request: Request) {

    const url = new URL(request.url);
    const city = url.searchParams.get("city");
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");


    if (!city && (!lat || !lon)) {
        return NextResponse.json({ error: "Please provide either a city name or latitude and longitude" },{ status: 400 });
    }
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "API key is missing" },
            { status: 500 }
        );
    }

    try{
        let coordinates: { lat: number; lon: number }

        if (lat && lon) {
            coordinates = {
                lat: parseFloat(lat),
                lon: parseFloat(lon)
            };
        } else {
            const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city!)}&limit=1&appid=${apiKey}`;
            const geocodingResponse = await fetch(geocodingUrl);

            if (!geocodingResponse.ok) {
                return NextResponse.json(
                    { error: "Failed to fetch coordinates" },
                    { status: 404 }
                );
            }

            const geocodingData = await geocodingResponse.json();
            if (geocodingData.length === 0) {
                return NextResponse.json(
                    { error: "City not found" },
                    { status: 404 }
                );
            }

            coordinates = {
                lat: geocodingData[0].lat,
                lon: geocodingData[0].lon
            };
        }

        const [currentRes, forecastRes, historicalRes, airQualityRes] = await Promise.allSettled([
        // Current weather
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`),

        // 5-day forecast
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`),

        // 7 day historical weather data
        Promise.all(
          Array.from({ length: 7 }, (_, i) => {
            const SecondsInDay = 86400; 
            const timestamp = Math.floor(Date.now() / 1000) - (i + 1) * SecondsInDay;
            return fetch(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${coordinates.lat}&lon=${coordinates.lon}&dt=${timestamp}&appid=${apiKey}&units=metric`);
          })
        ),

        // Air quality
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`)]);

        // process current weather
        let currentWeather = null;
        if (currentRes.status === 'fulfilled' && currentRes.value.ok) {
            currentWeather = await currentRes.value.json();
        }

        // return weather data
        const response = {
            current: currentWeather,
            coordinates: coordinates,
        };
  
      return NextResponse.json(response);

    } catch (error) {
        console.error("OpenWeather api error:", error);
        return NextResponse.json(
            { error: "internal server error" },
            { status: 500 }
        );
    }
}

