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
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets, Eye, Activity, ArrowLeft } from "lucide-react"

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
    if (aqhi >= 1 && aqhi <= 3) return "text-green-600 bg-green-50 border-green-200"
    if (aqhi >= 4 && aqhi <= 6) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    if (aqhi >= 7 && aqhi <= 10) return "text-orange-600 bg-orange-50 border-orange-200"
    if (aqhi > 10) return "text-red-600 bg-red-50 border-red-200"
    return "text-gray-600 bg-gray-50 border-gray-200"
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
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="bg-white/80 backdrop-blur-sm px-8 py-6 rounded-xl shadow-lg border border-red-200">
                        <div className="text-center text-red-600">
                            Error: {error || "No data available"}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen container mx-auto p-6 space-y-6">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-slate-800">{cityData.city} Information</h1>
                    <Button 
                        variant="outline" 
                        onClick={() => router.push('/')}
                        className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 transition-all duration-200"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
            </div>

            {/* City information cards */ }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-slate-700">Population</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-slate-700">
                            {cityData.population ? cityData.population.toLocaleString() : "N/A"}
                        </p>
                        <p className="text-sm text-slate-500">residents</p>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-slate-700">Timezone</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-slate-700">{cityData.timezone || "N/A"}</p>
                        <p className="text-sm text-slate-500">
                            Local time: {cityData.localTime || "N/A"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-slate-700">Elevation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-slate-700">
                            {cityData.elevation ? `${cityData.elevation}m` : "N/A"}
                        </p>
                        <p className="text-sm text-slate-500">above sea level</p>
                    </CardContent>
                </Card>
            </div>

            {/* Weather Section */ }
            {weatherLoading ? (
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                    <CardContent className="p-6">
                        <div className="text-center text-slate-600">Loading weather information...</div>
                    </CardContent>
                </Card>
            ) : weatherData ? (
                <>
                    { /* Current Weather and Air quality Card */ }
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current Weather Card */ }
                        {weatherData.current && (
                            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-slate-700">
                                    <Thermometer className="w-5 h-5 text-blue-600" />
                                            Current Weather
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-4xl font-bold text-blue-600">
                                            {Math.round(weatherData.current.main.temp)}°C
                                        </p>
                                        <p className="text-sm text-slate-600 capitalize">
                                            {weatherData.current.weather[0]?.description}
                                        </p>
                                        </div>
                                        <div className="bg-blue-50 p-3 rounded-full">
                                            <WeatherIcon weatherMain={weatherData.current.weather[0]?.main} />
                                        </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Thermometer className="w-4 h-4 text-orange-500" />
                                        <span>Feels like {Math.round(weatherData.current.main.feels_like)}°C</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Droplets className="w-4 h-4 text-blue-500" />
                                        <span>{weatherData.current.main.humidity}% humidity</span>
                                    </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Wind className="w-4 h-4 text-gray-500" />
                                            <span>{weatherData.current.wind.speed} m/s</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Eye className="w-4 h-4 text-purple-500" />
                                            <span>{weatherData.current.main.pressure} hPa</span>
                                        </div>
                                </div>
                            </CardContent>
                        </Card>
                        )}

                        {/* Air Quality Card */ }
                        {weatherData.air_quality && (
                            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center justify-center gap-2 text-slate-700"> 
                                        <Activity className="w-5 h-5 text-green-600" />
                                        Air Quality Index
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center">
                                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold border ${getAQHIColor(weatherData.air_quality.aqhi_canadian)}`}>
                                            AQHI: {weatherData.air_quality.aqhi_canadian}
                                        </div>
                                        <p className="mt-3 text-xl font-semibold text-slate-700">
                                            {weatherData.air_quality.category}
                                        </p>
                                    </div>

                                    {/* Risk scale legend */}
                                    <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                                        <div className="text-xs text-slate-600 space-y-1">
                                            <div className="flex justify-between">
                                                <span className="text-green-600 font-medium">1–3: Low Risk</span>
                                                <span className="text-yellow-600 font-medium">4–6: Moderate</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-orange-600 font-medium">7–10: High</span>
                                                <span className="text-red-600 font-medium">10+: Very High</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    {/* 5-Day Forecast */}
                    {weatherData.forecast_5day && weatherData.forecast_5day.length > 0 && (
                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-slate-700">5-Day Weather Forecast</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    {weatherData.forecast_5day.map((day, index) => (
                                        <div key={index} className="text-center p-4 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-blue-50/50 transition-colors duration-200">
                                            <p className="font-semibold text-sm mb-3 text-slate-700">
                                                {new Date(day.date).toLocaleDateString('en-US', { 
                                                    weekday: 'short', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                            <div className="flex justify-center mb-3">
                                                <div className="bg-white p-2 rounded-full shadow-sm">
                                                    <WeatherIcon weatherMain={day.weather.main} />
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-600 capitalize mb-3">
                                                {day.weather.description}
                                            </p>
                                            <div className="text-sm space-y-1">
                                                <p className="font-bold text-blue-600">{Math.round(day.temp.max)}°</p>
                                                <p className="text-slate-500">{Math.round(day.temp.min)}°</p>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-3 space-y-1">
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
                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-slate-700">7-Day Historical Weather</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {weatherData.historical_7days.map((day, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-slate-50/50 hover:bg-blue-50/50 transition-colors duration-200">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white p-2 rounded-full shadow-sm">
                                                    <WeatherIcon weatherMain={day.weather?.main} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-700">
                                                        {new Date(day.date).toLocaleDateString('en-US', { 
                                                            weekday: 'long', 
                                                            month: 'short', 
                                                            day: 'numeric' 
                                                        })}
                                                    </p>
                                                    <p className="text-sm text-slate-600 capitalize">
                                                        {day.weather?.description || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-blue-600">
                                                    {day.temp ? Math.round(day.temp) : 'N/A'}°C
                                                </p>
                                                <div className="text-xs text-slate-500 space-y-1">
                                                    <p>{day.humidity || 'N/A'}% humidity</p>
                                                    <p>{day.wind?.speed || 'N/A'} m/s wind</p>
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
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
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                    <CardContent className="p-6">
                        <div className="text-center text-slate-600">
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
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="bg-white/80 backdrop-blur-sm px-8 py-6 rounded-xl shadow-lg border border-slate-200">
                        <div className="text-center text-slate-700">Loading...</div>
                    </div>
                </div>
            </div>
        }>
            <InfoPageContent />
        </Suspense>
    )
}