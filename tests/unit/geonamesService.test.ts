import { fetchCityInfo } from '../../src/services/geonamesService';

/**
 * GeoNames Service Unit Tests
 * 
 * Tests the `geonamesService.ts` functions in isolation.
 * Mocks external API calls to GeoNames to ensure:
 *  - Proper request handling
 *  - Correct error throwing for invalid inputs
 *  - Accurate parsing of API responses
 * 
 * These tests verify internal service logic independent
 * of Next.js API routes.
 */

global.fetch = jest.fn();

describe('fetchCityInfo Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error when city param missing', async () => {
    await expect(fetchCityInfo('', 'user')).rejects.toThrow('Missing city parameter');
  });

  it('throws error when username missing', async () => {
    await expect(fetchCityInfo('Vancouver', '')).rejects.toThrow('GeoNames username is missing');
  });

  it('returns correct city info', async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          geonames: [{ lat: '49.2827', lng: '-123.1207', population: 631486, name: 'Vancouver' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ timezoneId: 'America/Vancouver', time: '2025-08-04 14:00' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ srtm3: 70 }),
      });

    const data = await fetchCityInfo('Vancouver', 'user');

    expect(data.city).toBe('Vancouver');
    expect(data.population).toBe(631486);
    expect(data.timezone).toBe('America/Vancouver');
    expect(data.localTime).toBe('2025-08-04 14:00');
    expect(data.elevation).toBe(70);
  });
});