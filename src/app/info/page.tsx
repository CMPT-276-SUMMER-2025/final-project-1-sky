"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
interface CityData {
    city: string
    population: number
    timezone: string
    localTime: string
    elevation: number
}

export default function InfoPage() {
    const searchParams = useSearchParams()
    const city = searchParams.get("city")
    const [cityData, setCityData] = useState<CityData | null>(null)
    const [loading, setLoading] = useState(true)
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
    {/* while the information is loading, print the following */ }
    if (loading) {
        return (
            <div className="container mx-auto p-6">
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
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">{cityData.city} Information</h1>
                <Button variant="outline" onClick={() => router.push('/')}>Back</Button>
            </div>
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
        </div >
    )
}