"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets, Eye, Activity } from "lucide-react"

interface CityData {
    city: string
    population: number
    timezone: string
    localTime: string
    elevation: number
}

// Defined weather data interface
interface WeatherData {
    current: {
        main:{
            temp: number
            feels_like: number
            humidity: number
            pressure: number
        }
        weather: Array<{
            main: string
            description: string
            icon: string
        }>
        wind: {
            speed: number
            deg: number
        }
    }
    coordinates: {
        lat: number
        lon: number
    }
    forecast_5day: Array<{
        date: string
        temp: {
            min: number
            max: number
            avg: number
        }
        weather: {
            main: string
            description: string
            icon: string
        }
        humidity: number
        rain_chance: number
        wind: {
            speed: number
            deg: number
        }
    }>
    historical_7days: Array<{
        date: string
        days_ago: number
        temp: number
        weather: {
            main: string
            description: string
            icon: string
        }
        humidity: number
        pressure: number
        wind: {
            speed: number
            deg: number
        }
    }>
    air_quality: {
        aqhi_canadian: number
        category: string
    }
}

// Air quality color helper
const getAQHIColor = (aqhi: number) => {
    if (aqhi >= 1 && aqhi <= 3) return "text-green-600 bg-green-50"
    if (aqhi >= 4 && aqhi <= 6) return "text-yellow-600 bg-yellow-50"
    if (aqhi >= 7 && aqhi <= 10) return "text-orange-600 bg-orange-50"
    if (aqhi > 10) return "text-red-600 bg-red-50"
    return "text-gray-600 bg-gray-50"
}

// Weather icon component
const WeatherIcon = ({ weatherMain }: { weatherMain: string }) => {
    switch (weatherMain?.toLowerCase()) {
        case 'clear':
            return <Sun className="w-6 h-6 text-yellow-500" />
        case 'clouds':
            return <Cloud className="w-6 h-6 text-gray-500" />
        case 'rain':
            return <CloudRain className="w-6 h-6 text-blue-500" />
        default:
            return <Cloud className="w-6 h-6 text-gray-400" />
    }
}

function InfoPageContent() {
    const searchParams = useSearchParams()
    const city = searchParams.get("city")
    const [cityData, setCityData] = useState<CityData | null>(null)
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(true)
    const [weatherLoading, setWeatherLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter();

    {/*grab city data from API */ }
    useEffect(() => {
        if (!city) {
            setError("No city selected")
            setLoading(false)
            return
        }

        const fetchCityData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/geonames?city=${encodeURIComponent(city)}`)

                if (!response.ok) {
                    throw new Error("Failed to fetch city data")
                }

                const data = await response.json()
                setCityData(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchCityData()
    }, [city])

    {/*grab weather data from API */ }
    useEffect(() => {
        if (!city) return

        const fetchWeatherData = async () => {
            try {
                setWeatherLoading(true)
                
                const response = await fetch(`/api/openweather?city=${encodeURIComponent(city)}`)
                
                if (!response.ok) {
                    // Just return without weather data if API fails
                    return
                }

                const data = await response.json()
                setWeatherData(data)
            } catch (err) {
                // Silently handle errors - weather is optional
            } finally {
                setWeatherLoading(false)
            }
        }

        fetchWeatherData()
    }, [city])


    {/* while the information is loading, print the following */ }
    if (loading) {
        return (
            <div className="container mx-auto p-6 ">
                <div className="text-center">Loading city information...</div>
            </div>
        )
    }

    if (error || !cityData) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center text-red-600">
                    Error: {error || "No data available"}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen container mx-auto p-6 space-y-6 ">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">{cityData.city} Information</h1>
                <Button variant="outline" onClick={() => router.push('/')}>Back</Button>
            </div>

            {/* City information cards */ }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Population</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {cityData.population ? cityData.population.toLocaleString() : "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">population</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Timezone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{cityData.timezone || "N/A"}</p>
                        <p className="text-sm text-gray-600">
                            Local time: {cityData.localTime || "N/A"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Elevation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">
                            {cityData.elevation ? `${cityData.elevation}m` : "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">above sea level</p>
                    </CardContent>
                </Card>
            </div>

            {/* Weather Section */ }
            {weatherLoading ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center">Loading weather information...</div>
                    </CardContent>
                </Card>
            ) : weatherData ? (
                <>
                    { /* Current Weather and Air quality Card */ }
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current Weather Card */ }
                        {weatherData.current && (
                            <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Thermometer className="w-5 h-5" />
                                            Current Weather
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-3xl font-bold">
                                            {Math.round(weatherData.current.main.temp)}°C
                                        </p>
                                        <p className="text-sm text-gray-600 capitalize">
                                            {weatherData.current.weather[0]?.description}
                                        </p>
                                        </div>
                                        <WeatherIcon weatherMain={weatherData.current.weather[0]?.main} />
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Thermometer className="w-4 h-4" />
                                        <span>Feels like {Math.round(weatherData.current.main.feels_like)}°C</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Droplets className="w-4 h-4" />
                                        <span>{weatherData.current.main.humidity}% humidity</span>
                                    </div>
                                        <div className="flex items-center gap-2">
                                            <Wind className="w-4 h-4" />
                                            <span>{weatherData.current.wind.speed} m/s</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            <span>{weatherData.current.main.pressure} hPa</span>
                                        </div>
                                </div>
                            </CardContent>
                        </Card>
                        )}

                        {/* Air Quality Card */ }
                        {weatherData.air_quality && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-center gap-2"> 
                                        Air Quality Index
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAQHIColor(weatherData.air_quality.aqhi_canadian)}`}>
                                            AQHI: {weatherData.air_quality.aqhi_canadian}
                                        </div>
                                        <p className="mt-2 text-lg font-semibold">
                                            {weatherData.air_quality.category}
                                        </p>
                                    </div>

                                    {/* Risk scale legend */}
                                    <div className="mt-4 text-xs text-gray-500">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-green-600">1–3: Low Risk</span>
                                            <span className="text-yellow-600">4–6: Moderate</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-orange-600">7–10: High</span>
                                            <span className="text-red-600">10+: Very High</span>
                                        </div>
                                    </div>
                                    
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    {/* 5-Day Forecast */}
                    {weatherData.forecast_5day && weatherData.forecast_5day.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>5-Day Weather Forecast</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    {weatherData.forecast_5day.map((day, index) => (
                                        <div key={index} className="text-center p-3 border rounded-lg">
                                            <p className="font-medium text-sm mb-2">
                                                {new Date(day.date).toLocaleDateString('en-US', { 
                                                    weekday: 'short', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                            <div className="flex justify-center mb-2">
                                                <WeatherIcon weatherMain={day.weather.main} />
                                            </div>
                                            <p className="text-xs text-gray-600 capitalize mb-2">
                                                {day.weather.description}
                                            </p>
                                            <div className="text-sm">
                                                <p className="font-bold">{Math.round(day.temp.max)}°</p>
                                                <p className="text-gray-600">{Math.round(day.temp.min)}°</p>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                <p>{Math.round(day.rain_chance)}% rain</p>
                                                <p>{day.wind.speed} m/s</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {/* 7-Day Historical Weather */}
                    {weatherData.historical_7days && weatherData.historical_7days.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>7-Day Historical Weather</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {weatherData.historical_7days.map((day, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <WeatherIcon weatherMain={day.weather?.main} />
                                                <div>
                                                    <p className="font-medium">
                                                        {new Date(day.date).toLocaleDateString('en-US', { 
                                                            weekday: 'long', 
                                                            month: 'short', 
                                                            day: 'numeric' 
                                                        })}
                                                    </p>
                                                    <p className="text-sm text-gray-600 capitalize">
                                                        {day.weather?.description || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold">
                                                    {day.temp ? Math.round(day.temp) : 'N/A'}°C
                                                </p>
                                                <div className="text-xs text-gray-500">
                                                    <p>{day.humidity || 'N/A'}% humidity</p>
                                                    <p>{day.wind?.speed || 'N/A'} km/h wind</p>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {day.days_ago} day{day.days_ago !== 1 ? 's' : ''} ago
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            ) : (
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center text-gray-600">
                            Weather information is not available for this location.
                        </div>
                    </CardContent>
                </Card>
            
            )
            }
        </div>
    )
}

export default function InfoPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto p-6">
                <div className="text-center">Loading...</div>
            </div>
        }>
            <InfoPageContent />
        </Suspense>
    )
}