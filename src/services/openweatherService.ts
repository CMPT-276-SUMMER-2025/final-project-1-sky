// src/services/openWeatherService.ts
export async function fetchOpenWeatherData(city: string | null, lat: string | null, lon: string | null, apiKey: string) {
  if (!city && (!lat || !lon)) {
    throw new Error("Please provide either a city name or latitude and longitude");
  }
  if (!apiKey) {
    throw new Error("API key is missing");
  }

  // Coordinates logic
  let coordinates: { lat: number; lon: number };
  if (lat && lon) {
    coordinates = { lat: parseFloat(lat), lon: parseFloat(lon) };
  } else {
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city!)}&limit=1&appid=${apiKey}`;
    const geocodingResponse = await fetch(geocodingUrl);
    if (!geocodingResponse.ok) throw new Error("Failed to fetch coordinates");
    const geocodingData = await geocodingResponse.json();
    if (geocodingData.length === 0) throw new Error("City not found");
    coordinates = { lat: geocodingData[0].lat, lon: geocodingData[0].lon };
  }

  // Fetch data in parallel
  const [currentRes, forecastRes, historicalResList, airQualityRes] = await Promise.allSettled([
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`),
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`),
    Promise.all(
      Array.from({ length: 7 }, (_, i) => {
        const SecondsInDay = 86400;
        const timestamp = Math.floor(Date.now() / 1000) - (i + 1) * SecondsInDay;
        return fetch(`https://history.openweathermap.org/data/2.5/history/city?lat=${coordinates.lat}&lon=${coordinates.lon}&type=hour&start=${timestamp}&cnt=24&appid=${apiKey}&units=metric`);
      })
    ),
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}`)
  ]);

  // Process current weather
  let currentWeather = null;
  if (currentRes.status === 'fulfilled' && currentRes.value.ok) {
    currentWeather = await currentRes.value.json();
  }

  // Process 5-day forecast
  let forecast = null;
  if (forecastRes.status === 'fulfilled' && forecastRes.value.ok) {
    const forecastData = await forecastRes.value.json();
    const dailyForecasts = new Map();

    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, {
          date,
          temps: [item.main.temp],
          temp_mins: [item.main.temp_min],
          temp_maxs: [item.main.temp_max],
          weather: item.weather[0],
          humidities: [item.main.humidity],
          rain_chances: [item.pop * 100],
          winds: [item.wind]
        });
      } else {
        const dayData = dailyForecasts.get(date);
        dayData.temps.push(item.main.temp);
        dayData.temp_mins.push(item.main.temp_min);
        dayData.temp_maxs.push(item.main.temp_max);
        dayData.humidities.push(item.main.humidity);
        dayData.rain_chances.push(item.pop * 100);
        dayData.winds.push(item.wind);
      }
    });

    forecast = Array.from(dailyForecasts.values()).slice(0, 5).map(dayData => ({
      date: dayData.date,
      temp: {
        min: Math.min(...dayData.temp_mins),
        max: Math.max(...dayData.temp_maxs),
        avg: Math.round(dayData.temps.reduce((a: number, b: number) => a + b, 0) / dayData.temps.length)
      },
      weather: dayData.weather,
      humidity: Math.round(dayData.humidities.reduce((a: number, b: number) => a + b, 0) / dayData.humidities.length),
      rain_chance: Math.round(dayData.rain_chances.reduce((a: number, b: number) => a + b, 0) / dayData.rain_chances.length),
      wind: {
        speed: Math.round((dayData.winds.reduce((a: number, b: any) => a + b.speed, 0) / dayData.winds.length) * 10) / 10,
        deg: Math.round(dayData.winds.reduce((a: number, b: any) => a + b.deg, 0) / dayData.winds.length)
      }
    }));
  }

  // Process 7-day historical weather
  let historical = null;
  if (historicalResList.status === 'fulfilled') {
    const historicalData = await Promise.allSettled(
      historicalResList.value.map(async (res: Response, index: number) => {
        if (res.ok) {
          const data = await res.json();
          const daysAgo = index + 1;
          const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

          if (data.list && data.list.length > 0) {
            const temps = data.list.map((item: any) => item.main?.temp).filter(Boolean);
            const humidities = data.list.map((item: any) => item.main?.humidity).filter(Boolean);
            const pressures = data.list.map((item: any) => item.main?.pressure).filter(Boolean);
            const windSpeeds = data.list.map((item: any) => item.wind?.speed).filter(Boolean);

            return {
              date: date.toDateString(),
              days_ago: daysAgo,
              temp: {
                min: temps.length > 0 ? Math.min(...temps) : null,
                max: temps.length > 0 ? Math.max(...temps) : null,
                avg: temps.length > 0 ? Math.round(temps.reduce((a: number, b: number) => a + b, 0) / temps.length) : null
              },
              weather: data.list[0].weather?.[0],
              humidity: humidities.length > 0 ? Math.round(humidities.reduce((a: number, b: number) => a + b, 0) / humidities.length) : null,
              pressure: pressures.length > 0 ? Math.round(pressures.reduce((a: number, b: number) => a + b, 0) / pressures.length) : null,
              wind: {
                speed: windSpeeds.length > 0 ? Math.round((windSpeeds.reduce((a: number, b: number) => a + b, 0) / windSpeeds.length) * 10) / 10 : null,
                deg: data.list[0].wind?.deg || null
              }
            };
          }
        }
        return null;
      })
    );

    historical = historicalData
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.status === 'fulfilled' ? r.value : null)
      .filter(Boolean);
  }

  // Process air quality
  let airQuality = null;
  if (airQualityRes.status === 'fulfilled' && airQualityRes.value.ok) {
    const airData = await airQualityRes.value.json();
    const openWeatherAqi = airData.list[0]?.main?.aqi;
    const convertToCanadianAQHI = (aqi: number) => ({ 1: 2, 2: 3, 3: 5, 4: 7, 5: 10 }[aqi] || aqi);
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

  return {
    current: currentWeather,
    coordinates,
    forecast_5day: forecast,
    historical_7days: historical,
    air_quality: airQuality
  };
}
