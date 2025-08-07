import fetch from 'cross-fetch';

/**
 * OpenWeather API Integration Tests
 * 
 * Tests the `/api/openweather` Next.js route end-to-end.
 * Validates correct API behavior for:
 *  - Successful requests with city input
 *  - Error handling for missing/invalid inputs
 *  - Structure and type of returned weather, forecast, and AQHI data
 */

describe('OpenWeather API Integration Tests', () => {
  const baseUrl = 'http://localhost:3000/api/openweather';

  it('returns full, correct structure for a valid city', async () => {
    const res = await fetch(`${baseUrl}?city=Vancouver`);
    expect(res.status).toBe(200);
    const data = await res.json();

    //  Coordinates 
    expect(data.coordinates).toBeDefined();
    expect(typeof data.coordinates.lat).toBe('number');
    expect(typeof data.coordinates.lon).toBe('number');

    // Current Weather 
    expect(data.current).toBeDefined();
    expect(typeof data.current.main.temp).toBe('number');
    expect(typeof data.current.main.humidity).toBe('number');
    expect(Array.isArray(data.current.weather)).toBe(true);
    expect(typeof data.current.weather[0].main).toBe('string');

    //  Forecast 5-Day 
    expect(Array.isArray(data.forecast_5day)).toBe(true);
    if (data.forecast_5day.length > 0) {
      const forecastItem = data.forecast_5day[0];
      expect(typeof forecastItem.date).toBe('string');
      expect(typeof forecastItem.temp.min).toBe('number');
      expect(typeof forecastItem.temp.max).toBe('number');
      expect(typeof forecastItem.temp.avg).toBe('number');
      expect(typeof forecastItem.weather.main).toBe('string');
      expect(typeof forecastItem.humidity).toBe('number');
      expect(typeof forecastItem.rain_chance).toBe('number');
      expect(typeof forecastItem.wind.speed).toBe('number');
      expect(typeof forecastItem.wind.deg).toBe('number');
    }

    //  Historical 7-Days 
    expect(Array.isArray(data.historical_7days)).toBe(true);
    if (data.historical_7days.length > 0) {
      const histItem = data.historical_7days[0];
      expect(typeof histItem.date).toBe('string');
      expect(typeof histItem.days_ago).toBe('number');
      expect(typeof histItem.temp.min).toBe('number');
      expect(typeof histItem.temp.max).toBe('number');
      expect(typeof histItem.temp.avg).toBe('number');
      expect(typeof histItem.weather.main).toBe('string');
      expect(typeof histItem.humidity).toBe('number');
      expect(typeof histItem.pressure).toBe('number');
      expect(typeof histItem.wind.speed).toBe('number');
      expect(typeof histItem.wind.deg).toBe('number');
    }

    //  Air Quality 
    expect(data.air_quality).toBeDefined();
    expect(typeof data.air_quality.aqhi_canadian).toBe('number');
    expect(typeof data.air_quality.category).toBe('string');
  });

  it('returns 400 error when no location info provided', async () => {
    const res = await fetch(baseUrl);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/provide/i);
  });
});
