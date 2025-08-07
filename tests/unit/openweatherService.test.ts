import { fetchOpenWeatherData } from '../../src/services/openweatherService';

describe('fetchOpenWeatherData Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error if neither city nor lat/lon provided', async () => {
    await expect(fetchOpenWeatherData(null, null, null, 'apikey')).rejects.toThrow(
      'Please provide either a city name or latitude and longitude'
    );
  });

  it('throws error if apiKey missing', async () => {
    await expect(fetchOpenWeatherData('Vancouver', null, null, '')).rejects.toThrow('API key is missing');
  });

  it('fetches data correctly using city name', async () => {
    // Mock geocoding API
    (global as any).fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ lat: 49.2827, lon: -123.1207 }],
      });

    // Mock allSettled for current, forecast, historical, air quality
    jest.spyOn(Promise, 'allSettled').mockResolvedValue([
      // Current Weather
      {
        status: 'fulfilled',
        value: {
          ok: true,
          json: async () => ({
            main: { temp: 22, humidity: 40 },
            weather: [{ main: 'Clear' }],
          }),
        },
      },
      // Forecast (5-day)
      {
        status: 'fulfilled',
        value: {
          ok: true,
          json: async () => ({
            list: [
              {
                dt: 1627812000,
                main: { temp: 20, temp_min: 18, temp_max: 22, humidity: 50 },
                weather: [{ main: 'Clear' }],
                pop: 0.1,
                wind: { speed: 5, deg: 180 },
              },
              {
                dt: 1627898400,
                main: { temp: 21, temp_min: 19, temp_max: 23, humidity: 55 },
                weather: [{ main: 'Cloudy' }],
                pop: 0.2,
                wind: { speed: 6, deg: 185 },
              },
            ],
          }),
        },
      },
      {
        status: 'fulfilled',
        value: Array.from({ length: 7 }).map((_, i) => ({
        ok: true,
        json: async () => ({
            list: [
            {
                dt: 1627800000 - i * 86400, // some timestamp for each day
                main: { temp: 19 + i, humidity: 48 + i, pressure: 1010 + i },
                weather: [{ main: 'Cloudy' }],
                wind: { speed: 3 + i, deg: 170 + i },
            },
            // more hourly data points could be added here if you want
            ],
        }),
        })),
    },
      // Air Quality
      {
        status: 'fulfilled',
        value: {
          ok: true,
          json: async () => ({
            list: [{ main: { aqi: 2 } }],
          }),
        },
      },
    ]);

    const data = await fetchOpenWeatherData('Vancouver', null, null, 'apikey');

    // Coordinates
    expect(data.coordinates.lat).toBeCloseTo(49.2827);
    expect(data.coordinates.lon).toBeCloseTo(-123.1207);

    // Current Weather
    expect(data.current).toBeDefined();
    expect(typeof data.current.main.temp).toBe('number');
    expect(typeof data.current.main.humidity).toBe('number');
    expect(data.current.weather).toBeDefined();

    // Forecast 5-day
    expect(data.forecast_5day).not.toBeNull();
    expect(Array.isArray(data.forecast_5day)).toBe(true);
    if (data.forecast_5day) {
      expect(data.forecast_5day.length).toBeGreaterThan(0);
      const forecastItem = data.forecast_5day[0];
      expect(typeof forecastItem.date).toBe('string');
      expect(forecastItem.temp).toBeDefined();
      expect(typeof forecastItem.temp.min).toBe('number');
      expect(typeof forecastItem.temp.max).toBe('number');
      expect(typeof forecastItem.temp.avg).toBe('number');
      expect(forecastItem.weather).toBeDefined();
      expect(typeof forecastItem.humidity).toBe('number');
      expect(typeof forecastItem.rain_chance).toBe('number');
      expect(forecastItem.wind).toBeDefined();
      expect(typeof forecastItem.wind.speed).toBe('number');
      expect(typeof forecastItem.wind.deg).toBe('number');
    }

    // Air Quality
    expect(data.air_quality).toBeDefined();
    if (data.air_quality) {
      expect(typeof data.air_quality.aqhi_canadian).toBe('number');
      expect(typeof data.air_quality.category).toBe('string');
    }
  });
});