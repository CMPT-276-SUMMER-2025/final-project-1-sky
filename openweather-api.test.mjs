// openweather-api.test.mjs
import assert from 'assert';
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/openweather';

// ✅ Test 1: Valid city
async function testValidCity() {
    console.log('Running: testValidCity...');
    const res = await fetch(`${BASE_URL}?city=Vancouver`);
    assert.strictEqual(res.status, 200, 'Expected status 200 for valid city');
    const data = await res.json();

    assert.ok(data.current, 'Expected current weather data');
    assert.ok(typeof data.coordinates.lat === 'number', 'Expected numeric latitude');
    assert.ok(typeof data.coordinates.lon === 'number', 'Expected numeric longitude');
    assert.ok(Array.isArray(data.forecast_5day), 'Expected forecast_5day to be an array');
    assert.ok(Array.isArray(data.historical_7days), 'Expected historical_7days to be an array');
    assert.ok(data.air_quality, 'Expected air quality data');

    console.log('✅ testValidCity passed');
}

// ✅ Test 2: Missing parameters
async function testMissingParams() {
    console.log('Running: testMissingParams...');
    const res = await fetch(BASE_URL);
    assert.strictEqual(res.status, 400, 'Expected status 400 for missing params');
    const data = await res.json();
    assert.ok(data.error.includes('Please provide'), 'Expected error about missing params');
    console.log('✅ testMissingParams passed');
}

// ✅ Test 3: Invalid city name
async function testInvalidCity() {
    console.log('Running: testInvalidCity...');
    const res = await fetch(`${BASE_URL}?city=zzzzzzzzzzzzzz`);
    assert.strictEqual(res.status, 404, 'Expected status 404 for invalid city');
    const data = await res.json();
    assert.ok(data.error.includes('City not found'), 'Expected error about city not found');
    console.log('✅ testInvalidCity passed');
}

// ✅ Test 4: Historical data length
async function testHistoricalDataLength() {
    console.log('Running: testHistoricalDataLength...');
    const res = await fetch(`${BASE_URL}?city=Vancouver`);
    assert.strictEqual(res.status, 200, 'Expected status 200 for valid city');
    const data = await res.json();

    assert.ok(Array.isArray(data.historical_7days), 'Expected historical_7days to be an array');
    assert.strictEqual(data.historical_7days.length, 7, 'Expected exactly 7 historical days');
    console.log('✅ testHistoricalDataLength passed');
}

// ✅ Test 5: Forecast 5-day length
async function testForecastLength() {
    console.log('Running: testForecastLength...');
    const res = await fetch(`${BASE_URL}?city=Vancouver`);
    assert.strictEqual(res.status, 200, 'Expected status 200 for valid city');
    const data = await res.json();

    assert.ok(Array.isArray(data.forecast_5day), 'Expected forecast_5day to be an array');
    assert.strictEqual(data.forecast_5day.length, 5, 'Expected exactly 5 forecast days');
    console.log('✅ testForecastLength passed');
}

// ✅ Test 6: City name with special characters
async function testSpecialCharacterCity() {
    console.log('Running: testSpecialCharacterCity...');
    const res = await fetch(`${BASE_URL}?city=${encodeURIComponent('São Paulo')}`);
    assert.strictEqual(res.status, 200, 'Expected status 200 for special char city');
    const data = await res.json();

    assert.ok(data.current, 'Expected current weather data');
    assert.ok(data.coordinates, 'Expected coordinates in response');
    console.log('✅ testSpecialCharacterCity passed');
}

// ✅ Test 7: Latitude/Longitude input
async function testCoords() {
    console.log('Running: testCoords...');
    // Vancouver coordinates
    const lat = 49.2827;
    const lon = -123.1207;
    const res = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}`);
    assert.strictEqual(res.status, 200, 'Expected status 200 for lat/lon');
    const data = await res.json();

    assert.ok(data.current, 'Expected current weather data');
    assert.ok(typeof data.coordinates.lat === 'number', 'Expected numeric latitude');
    assert.ok(typeof data.coordinates.lon === 'number', 'Expected numeric longitude');
    console.log('✅ testCoords passed');
}

// 🚀 Run all tests
async function runTests() {
    console.log('Running OpenWeather API tests...');
    await testValidCity();
    await testMissingParams();
    await testInvalidCity();
    await testHistoricalDataLength();
    await testForecastLength();
    await testSpecialCharacterCity();
    await testCoords();
    console.log('All OpenWeather tests passed');
}

runTests().catch(err => {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
});
