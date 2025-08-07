// src/services/geonamesService.ts

export async function fetchCityInfo(city: string, username: string) {
  if (!city) throw new Error("Missing city parameter");
  if (!username) throw new Error("GeoNames username is missing");

  // Step 1: Search for city info
  const searchUrl = `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(city)}&maxRows=1&username=${username}`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) throw new Error("Failed to fetch city data");
  const searchData = await searchRes.json();

  const cityData = searchData.geonames?.[0];
  if (!cityData) throw new Error("City not found");

  const { lat, lng, population, name } = cityData;

  // Step 2: Fetch timezone
  const timezoneUrl = `https://secure.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=${username}`;
  const tzRes = await fetch(timezoneUrl);
  if (!tzRes.ok) throw new Error("Failed to fetch timezone");
  const timezoneData = await tzRes.json();

  // Step 3: Fetch elevation
  const elevationUrl = `https://secure.geonames.org/srtm3JSON?lat=${lat}&lng=${lng}&username=${username}`;
  const elevRes = await fetch(elevationUrl);
  if (!elevRes.ok) throw new Error("Failed to fetch elevation");
  const elevationData = await elevRes.json();

  // Return formatted result
  return {
    city: name,
    coordinates: { lat, lng },
    population,
    timezone: timezoneData.timezoneId,
    localTime: timezoneData.time,
    elevation: elevationData.srtm3,
  };
}