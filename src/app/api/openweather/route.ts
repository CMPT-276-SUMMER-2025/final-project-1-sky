import { NextResponse } from "next/server";

export async function GET(request: Request) {

    type ForecastItem = {
        dt: number;
        main: {
          temp: number;
          temp_min: number;
          temp_max: number;
          humidity: number;
        };
        weather: { description: string; icon: string }[];
        wind: { speed: number; deg: number };
        pop: number;
      };

    const url = new URL(request.url);
    const city = url.searchParams.get("city");
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");


    if (!city && (!lat || !lon)) {
        return NextResponse.json(
            { error: "Please provide either a city name or latitude and longitude" },
            { status: 400 });
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
            return fetch(`https://history.openweathermap.org/data/2.5/history/city?lat=${coordinates.lat}&lon=${coordinates.lon}&type=hour&start=${timestamp}&cnt=1&appid=${apiKey}&units=metric`);
          })
        ),

        // Air quality
        fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`)]);

        // process current weather
        let currentWeather = null;
        if (currentRes.status === 'fulfilled' && currentRes.value.ok) {
            currentWeather = await currentRes.value.json();
        }

        // process 5-day forecast
        let forecast = null;
        if (forecastRes.status === 'fulfilled' && forecastRes.value.ok) {
            const forecastData = await forecastRes.value.json();
            const dailyForecasts = new Map();
            
        
            forecastData.list.forEach((item: ForecastItem) => {
                const date = new Date(item.dt * 1000).toDateString();
                if (!dailyForecasts.has(date) && dailyForecasts.size < 5) {
                    dailyForecasts.set(date, {
                        date: date,
                        temp: {
                            min: item.main.temp_min,
                            max: item.main.temp_max,
                            avg: item.main.temp
                        },
                        weather: item.weather[0],
                        humidity: item.main.humidity,
                        rain_chance: item.pop * 100,
                        wind: item.wind
                    });
                }
            });
            forecast = Array.from(dailyForecasts.values());
        }

        // Process past weather 7 days
        let historical = null;
        if (historicalRes.status === 'fulfilled') {
            const historicalData = await Promise.allSettled(
                historicalRes.value.map(async (res: Response, index: number) => {
                if (res.ok) {
                    const data = await res.json();                    
                    const daysAgo = index + 1;
                    const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
                    const historyItem = data.list && data.list[0];

                    if (historyItem) {
                        return {
                            date: date.toDateString(),
                            days_ago: daysAgo,
                            temp: historyItem.main?.temp,
                            weather: historyItem.weather?.[0],
                            humidity: historyItem.main?.humidity,
                            pressure: historyItem.main?.pressure,
                            wind: historyItem.wind
                        };
                    }
                }
                return null;
                })
            );
            
            historical = historicalData
                .filter(result => result.status === 'fulfilled' && result.value !== null)
                .map(result => result.status === 'fulfilled' ? result.value : null)
                .filter(Boolean);
        }

        // Process air quality with Canadian AQHI conversion
        let airQuality = null;
            if (airQualityRes.status === 'fulfilled' && airQualityRes.value.ok) {
                const airData = await airQualityRes.value.json();
                const openWeatherAqi = airData.list[0]?.main?.aqi;
                
                // Convert OpenWeatherMap AQI (1-5) to Canadian AQHI-style scale (1-10+)
                const convertToCanadianAQHI = (aqi: number) => {
                    const conversion = {
                        1: 2,
                        2: 3,
                        3: 5,
                        4: 7,
                        5: 10
                    };
                    return conversion[aqi as keyof typeof conversion] || aqi;
                };
                
                // Canadian AQHI categories
                const getCanadianAQHICategory = (aqhi: number) => {
                    if (aqhi >= 1 && aqhi <= 3) return "Low Health Risk";
                    if (aqhi >= 4 && aqhi <= 6) return "Moderate Health Risk";
                    if (aqhi >= 7 && aqhi <= 10) return "High Health Risk";
                    if (aqhi > 10) return "Very High Health Risk";
                    return "Unknown";
                };
                
                const canadianAQHI = convertToCanadianAQHI(openWeatherAqi);
                
                airQuality = {
                    aqhi_canadian: canadianAQHI,
                    category: getCanadianAQHICategory(canadianAQHI)
                };
            }




        // return weather data
        const response = {
            current: currentWeather,
            coordinates: coordinates,
            forecast_5day: forecast,
            historical_7days: historical,
            air_quality: airQuality,
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

