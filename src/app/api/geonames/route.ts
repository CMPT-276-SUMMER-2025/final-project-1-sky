import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const url = new URL(req.url)
    const city = url.searchParams.get("city")

    if (!city) {
        return NextResponse.json({ error: "Missing city parameter" }, { status: 400 })
    }

    const username = process.env.GEONAMES_USERNAME
    if (!username) {
        return NextResponse.json({ error: "GeoNames username is missing" }, { status: 500 })
    }

    try {
        // 1. Get city info
        const searchRes = await fetch(
            `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(city)}&maxRows=1&username=${username}`
        )
        const searchData = await searchRes.json()

        const cityData = searchData.geonames?.[0]
        if (!cityData) {
            return NextResponse.json({ error: "City not found" }, { status: 404 })
        }

        const { lat, lng, population, name } = cityData

        // 2. Get timezone
        const tzRes = await fetch(
            `https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=${username}`
        )
        const timezone = await tzRes.json()

        // 3. Get elevation
        const elevRes = await fetch(
            `https://secure.geonames.org/srtm3JSON?lat=${lat}&lng=${lng}&username=${username}`
        )
        const elevation = await elevRes.json()

        console.log('GeoNames city data:', cityData);
        console.log('Timezone data:', timezone);
        console.log('Elevation data:', elevation);


        return NextResponse.json({
            city: name,
            population,
            timezone: timezone.timezoneId,
            localTime: timezone.time,
            elevation: elevation.srtm3,
        })
    } catch (error) {
        console.error('GeoNames API Error:', error)
        return NextResponse.json(
            { error: "Failed to fetch location data" },
            { status: 500 }
        )
    }
}