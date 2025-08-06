import fetch from 'cross-fetch';

describe('GeoNames API Integration Tests', () => {
	const baseUrl = 'http://localhost:3000/api/geonames';

	it('returns full, correct structure for a valid city', async () => {
	const res = await fetch(`${baseUrl}?city=Vancouver`);
	expect(res.status).toBe(200);
	const data = await res.json();

	// Exact values (or close enough for lat/long)
	expect(data.city).toBe('Vancouver');
	expect(data.coordinates).toBeDefined();
	expect(typeof data.coordinates.lat).toBe('string');
  	expect(typeof data.coordinates.lng).toBe('string');
  	expect(parseFloat(data.coordinates.lat)).toBeCloseTo(49.28, 1);
  	expect(parseFloat(data.coordinates.lng)).toBeCloseTo(-123.11, 1);
	expect(data.timezone).toBe('America/Vancouver');

	// localTime format check 
	expect(typeof data.localTime).toBe('string');
	expect(Date.parse(data.localTime)).not.toBeNaN();

	// Elevation can be exact or close
	expect(typeof data.elevation).toBe('number');
	expect(data.elevation).toBeGreaterThan(0);

	// Population is number and positive (don't fix exact for if API updates)
	expect(typeof data.population).toBe('number');
	expect(data.population).toBeGreaterThan(0);
	});

	it('returns 400 error when city param missing', async () => {
		const res = await fetch(baseUrl);
		expect(res.status).toBe(400);
		const data = await res.json();
		expect(data.error).toMatch(/missing/i);
	});
});
