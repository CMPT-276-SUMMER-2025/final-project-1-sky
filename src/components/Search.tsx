"use client";
import { useState, useEffect } from "react";
import { Combobox } from "./comboboxForm";

interface CityOption {
    label: string;
    value: string;
}

export default function Search() {
    const [input, setInput] = useState("");
    const [cities, setCities] = useState<CityOption[]>([]);
    const [loading, setLoading] = useState(false);
    // create interface to match types
    interface APICity {
        city: string;
        regionCode: string;
        id: string;
    }
    useEffect(() => {
        const handler = setTimeout(() => {
            const fetchCities = async () => {
                setLoading(true);
                try {
                    if (!input.trim()) {
                        // Fetch pages sequentially to avoid rate limiting
                        const allCities = [];

                        for (let page = 1; page <= 5; page++) {
                            try {
                                const res = await fetch(`/api/geodb?page=${page}`);

                                if (res.status === 429) {
                                    // If rate limited, wait a bit and try again
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                    const retryRes = await fetch(`/api/geodb?page=${page}`);
                                    if (retryRes.ok) {
                                        const data = await retryRes.json();
                                        if (data.data) {
                                            allCities.push(...data.data);
                                        }
                                    }
                                } else if (res.ok) {
                                    const data = await res.json();
                                    if (data.data) {
                                        allCities.push(...data.data);
                                    }
                                }

                                // Small delay between requests to be nice to the API
                                if (page < 5) {
                                    await new Promise(resolve => setTimeout(resolve, 100));
                                }
                            } catch (pageError) {
                                console.error(`Error fetching page ${page}:`, pageError);
                                // Continue with other pages
                            }
                        }

                        const options = allCities.map((city: APICity) => ({
                            label: `${city.city}, ${city.regionCode}`,
                            value: city.id,
                        }));

                        setCities(options);
                    } else {
                        // Search by input
                        const res = await fetch(`/api/geodb?search=${encodeURIComponent(input)}`);
                        const data = await res.json();
                        if (data.data) {
                            const options = data.data.map((city: any) => ({
                                label: `${city.city}, ${city.regionCode}`,
                                value: city.id,
                            }));
                            setCities(options);
                        } else {
                            setCities([]);
                        }
                    }
                } catch (err) {
                    console.error("Error fetching cities:", err);
                    setCities([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchCities();
        }, 500);

        return () => clearTimeout(handler);
    }, [input]);

    return (
        <Combobox
            options={cities}
            loading={loading}
            onInputChange={(value) => setInput(value)}
            placeholder="Search for a Canadian city..."
        />
    );
}