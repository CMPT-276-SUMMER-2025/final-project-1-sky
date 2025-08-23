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

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { 
    Cloud, 
    Sun, 
    CloudRain, 
    Thermometer, 
    Wind, 
    Droplets, 
    Eye, 
    Activity, 
    ArrowLeft, 
    Plus, 
    X,
    Check,
    ChevronsUpDown
} from "lucide-react"

// Utility function for className concatenation
function cn(...classes: (string | undefined | null | boolean)[]): string {
    return classes.filter(Boolean).join(' ')
}

// List of Canadian cities
const Cities = [
    "Toronto, Ontario",
    "Montreal, Quebec",
    "Calgary, Alberta",
    "Edmonton, Alberta",
    "Ottawa, Ontario",
    "Winnipeg, Manitoba",
    "Mississauga, Ontario",
    "Brampton, Ontario",
    "Vancouver, British Columbia",
    "Surrey, British Columbia",
    "Hamilton, Ontario",
    "Quebec City, Quebec",
    "Halifax, Nova Scotia",
    "London, Ontario",
    "Laval, Quebec",
    "Markham, Ontario",
    "Vaughan, Ontario",
    "Gatineau, Quebec",
    "Saskatoon, Saskatchewan",
    "Kitchener, Ontario",
]

interface CityData {
    city: string
    population: number
    timezone: string
    localTime: string
    elevation: number
}

interface WeatherData {
    current: {
        main: {
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
    air_quality: {
        aqhi_canadian: number
        category: string
    }
}

interface CityComparison {
    name: string
    cityData: CityData | null
    weatherData: WeatherData | null
    loading: boolean
    error: string | null
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

function ComparePageContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const initialCities = searchParams.get("cities")?.split("|").filter(Boolean) || []
    
    const [cities, setCities] = useState<CityComparison[]>([])
    const [newCityName, setNewCityName] = useState("")
    const [open, setOpen] = useState(false)

    // Initialize cities from URL params
    useEffect(() => {
        if (initialCities.length > 0) {
            const initialCityData = initialCities.map(city => ({
                name: decodeURIComponent(city), // Decode the city name properly
                cityData: null,
                weatherData: null,
                loading: true,
                error: null
            }))
            setCities(initialCityData)
        }
    }, [initialCities.join(',')]) // Use join to prevent infinite re-renders

    // Fetch data for each city
    useEffect(() => {
        cities.forEach((city, index) => {
            if (city.loading && !city.cityData) {
                fetchCityData(city.name, index)
                fetchWeatherData(city.name, index)
            }
        })
    }, [cities])

    const fetchCityData = async (cityName: string, index: number) => {
        try {
            const response = await fetch(`/api/geonames?city=${encodeURIComponent(cityName)}`)
            if (!response.ok) throw new Error("Failed to fetch city data")
            
            const data = await response.json()
            
            setCities(prev => prev.map((city, i) => 
                i === index ? { ...city, cityData: data, loading: false } : city
            ))
        } catch (err) {
            setCities(prev => prev.map((city, i) => 
                i === index ? { 
                    ...city, 
                    error: err instanceof Error ? err.message : "Failed to load city data",
                    loading: false 
                } : city
            ))
        }
    }

    const fetchWeatherData = async (cityName: string, index: number) => {
        try {
            const response = await fetch(`/api/openweather?city=${encodeURIComponent(cityName)}`)
            if (!response.ok) return // Weather is optional
            
            const data = await response.json()
            
            setCities(prev => prev.map((city, i) => 
                i === index ? { ...city, weatherData: data } : city
            ))
        } catch (err) {
            // Silently handle weather errors
        }
    }

    const addCity = async () => {
        if (!newCityName.trim() || cities.length >= 4) return
        
        const newCity: CityComparison = {
            name: newCityName.trim(),
            cityData: null,
            weatherData: null,
            loading: true,
            error: null
        }
        
        setCities(prev => [...prev, newCity])
        setNewCityName("")
        setOpen(false)
        
        // Update URL with properly encoded city names
        const updatedCities = [...cities.map(c => c.name), newCityName.trim()]
        router.push(`/compare?cities=${updatedCities.map(city => encodeURIComponent(city)).join("|")}`)
    }

    const removeCity = (index: number) => {
        const updatedCities = cities.filter((_, i) => i !== index)
        setCities(updatedCities)
        
        // Update URL with properly encoded city names
        if (updatedCities.length > 0) {
            router.push(`/compare?cities=${updatedCities.map(c => encodeURIComponent(c.name)).join("|")}`)
        } else {
            router.push("/compare")
        }
    }

    if (cities.length === 0) {
        return (
            <div className="min-h-screen container mx-auto p-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-slate-800">Compare Cities</h1>
                        <Button 
                            variant="outline" 
                            onClick={() => router.push('/')}
                            className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </div>
                </div>
                
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                    <CardContent className="p-12 text-center">
                        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Start Comparing Cities</h2>
                        <p className="text-slate-600 mb-6">Add cities to compare their weather, population, and other key metrics side by side.</p>
                        
                        <div className="flex items-center gap-3 max-w-md mx-auto">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={cn(
                                            "w-[300px] justify-between bg-white border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm",
                                            !newCityName && "text-slate-500"
                                        )}
                                    >
                                        {newCityName || "Select City"}
                                        <ChevronsUpDown className="opacity-50 text-slate-400" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent 
                                    className="w-[300px] p-0 bg-white border-slate-200 shadow-lg" 
                                    side="bottom" 
                                    align="start"
                                >
                                    <Command className="bg-white">
                                        <CommandInput
                                            placeholder="Search cities..."
                                            className="h-9 border-0 focus:ring-0"
                                        />
                                        <CommandList className="max-h-48 overflow-y-auto">
                                            <CommandEmpty className="text-slate-500 text-center py-4">
                                                Not a supported city
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {Cities.filter(city => !cities.some(c => c.name === city)).map((city) => (
                                                    <CommandItem
                                                        value={city}
                                                        key={city}
                                                        onSelect={() => {
                                                            setNewCityName(city)
                                                            setOpen(false)
                                                        }}
                                                        className="hover:bg-blue-50 cursor-pointer"
                                                    >
                                                        {city}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto text-blue-600",
                                                                city === newCityName
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Button onClick={addCity} disabled={!newCityName.trim()}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add City
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen container mx-auto p-6 space-y-6">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-slate-800">Compare Cities</h1>
                    <Button 
                        variant="outline" 
                        onClick={() => router.push('/')}
                        className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
                
                {/* Add City Section */}
                {cities.length < 4 && (
                    <div className="flex items-center gap-3">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className={cn(
                                        "w-[280px] justify-between bg-white border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm",
                                        !newCityName && "text-slate-500"
                                    )}
                                >
                                    {newCityName || "Add another city to compare..."}
                                    <ChevronsUpDown className="opacity-50 text-slate-400" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent 
                                className="w-[280px] p-0 bg-white border-slate-200 shadow-lg" 
                                side="bottom" 
                                align="start"
                            >
                                <Command className="bg-white">
                                    <CommandInput
                                        placeholder="Search cities..."
                                        className="h-9 border-0 focus:ring-0"
                                    />
                                    <CommandList className="max-h-48 overflow-y-auto">
                                        <CommandEmpty className="text-slate-500 text-center py-4">
                                            Not a supported city
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {Cities.filter(city => !cities.some(c => c.name === city)).map((city) => (
                                                <CommandItem
                                                    value={city}
                                                    key={city}
                                                    onSelect={() => {
                                                        setNewCityName(city)
                                                        setOpen(false)
                                                    }}
                                                    className="hover:bg-blue-50 cursor-pointer"
                                                >
                                                    {city}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto text-blue-600",
                                                            city === newCityName
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <Button onClick={addCity} disabled={!newCityName.trim()} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add City
                        </Button>
                    </div>
                )}
            </div>

            {/* City Comparison Grid */}
            <div className={`grid grid-cols-1 ${cities.length === 2 ? 'md:grid-cols-2' : cities.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4'} gap-6`}>
                {cities.map((city, index) => (
                    <div key={index} className="space-y-4">
                        {/* City Header */}
                        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl text-slate-800">{city.name}</CardTitle>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeCity(index)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>

                        {city.loading ? (
                            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                                <CardContent className="p-6 text-center">
                                    <div className="text-slate-600">Loading...</div>
                                </CardContent>
                            </Card>
                        ) : city.error ? (
                            <Card className="bg-white/80 backdrop-blur-sm border-red-200 shadow-lg">
                                <CardContent className="p-6 text-center">
                                    <div className="text-red-600">Error: {city.error}</div>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Current Weather */}
                                {city.weatherData?.current && (
                                    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm text-slate-600">Current Weather</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <p className="text-3xl font-bold text-slate-700">
                                                        {Math.round(city.weatherData.current.main.temp)}°C
                                                    </p>
                                                    <p className="text-sm text-slate-600 capitalize">
                                                        {city.weatherData.current.weather[0]?.description}
                                                    </p>
                                                </div>
                                                <div className="bg-blue-50 p-2 rounded-full">
                                                    <WeatherIcon weatherMain={city.weatherData.current.weather[0]?.main} />
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-sm text-slate-600">
                                                <div className="flex items-center justify-between">
                                                    <span>Feels like</span>
                                                    <span>{Math.round(city.weatherData.current.main.feels_like)}°C</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>Humidity</span>
                                                    <span>{city.weatherData.current.main.humidity}%</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>Wind</span>
                                                    <span>{city.weatherData.current.wind.speed} m/s</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Air Quality */}
                                {city.weatherData?.air_quality && (
                                    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm text-slate-600">Air Quality</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="text-center">
                                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getAQHIColor(city.weatherData.air_quality.aqhi_canadian)}`}>
                                                    AQHI: {city.weatherData.air_quality.aqhi_canadian}
                                                </div>
                                                <p className="mt-2 text-sm font-medium text-slate-700">
                                                    {city.weatherData.air_quality.category}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* City Info */}
                                {city.cityData && (
                                    <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm text-slate-600">City Info</CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-600">Population</span>
                                                    <span className="font-medium text-slate-700">
                                                        {city.cityData.population ? city.cityData.population.toLocaleString() : "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-600">Elevation</span>
                                                    <span className="font-medium text-slate-700">
                                                        {city.cityData.elevation ? `${city.cityData.elevation}m` : "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-600">Timezone</span>
                                                    <span className="font-medium text-slate-700 text-xs">
                                                        {city.cityData.timezone || "N/A"}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Comparison Summary */}
            {cities.length >= 2 && cities.every(city => city.weatherData?.current) && (
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-slate-700">Quick Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-2">Warmest</h4>
                                {(() => {
                                    const warmest = cities.reduce((prev, current) => 
                                        (current.weatherData?.current?.main?.temp || -999) > (prev.weatherData?.current?.main?.temp || -999) ? current : prev
                                    )
                                    return (
                                        <p className="text-blue-700">
                                            {warmest.name}: {Math.round(warmest.weatherData?.current?.main?.temp || 0)}°C
                                        </p>
                                    )
                                })()}
                            </div>
                            
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-green-800 mb-2">Best Air Quality</h4>
                                {(() => {
                                    const bestAir = cities.reduce((prev, current) => 
                                        (current.weatherData?.air_quality?.aqhi_canadian || 999) < (prev.weatherData?.air_quality?.aqhi_canadian || 999) ? current : prev
                                    )
                                    return (
                                        <p className="text-green-700">
                                            {bestAir.name}: AQHI {bestAir.weatherData?.air_quality?.aqhi_canadian || "N/A"}
                                        </p>
                                    )
                                })()}
                            </div>
                            
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-purple-800 mb-2">Largest</h4>
                                {(() => {
                                    const largest = cities.reduce((prev, current) => 
                                        (current.cityData?.population || 0) > (prev.cityData?.population || 0) ? current : prev
                                    )
                                    return (
                                        <p className="text-purple-700">
                                            {largest.name}: {largest.cityData?.population?.toLocaleString() || "N/A"}
                                        </p>
                                    )
                                })()}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default function ComparePage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="bg-white/80 backdrop-blur-sm px-8 py-6 rounded-xl shadow-lg border border-slate-200">
                        <div className="text-center text-slate-700">Loading comparison...</div>
                    </div>
                </div>
            </div>
        }>
            <ComparePageContent />
        </Suspense>
    )
}