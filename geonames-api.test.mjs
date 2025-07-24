import assert from 'assert';
import fetch from 'node-fetch';

async function testValidCity() {
    const res = await fetch('http://localhost:3000/api/geonames?city=Vancouver');
    assert.strictEqual(res.status, 200, 'Expected status 200 for valid city');
    const data = await res.json();

    assert.ok(data.city === 'Vancouver', 'Expected city name to be Vancouver');
    assert.ok(typeof data.population === 'number', 'Expected population to be a number');
    assert.ok(typeof data.timezone === 'string', 'Expected timezone to be a string');
    assert.ok(typeof data.localTime === 'string', 'Expected localTime to be a string');
    assert.ok(typeof data.elevation === 'number', 'Expected elevation to be a number');

    console.log('✅ testValidCity passed');
}

async function testMissingCity() {
    const res = await fetch('http://localhost:3000/api/geonames');
    assert.strictEqual(res.status, 400, 'Expected status 400 for missing city param');
    const data = await res.json();
    assert.ok(data.error.includes('Missing'), 'Expected error about missing city');

    console.log('✅ testMissingCity passed');
}

async function testInvalidCity() {
    const res = await fetch('http://localhost:3000/api/geonames?city=asldkfjalskdjf');
    assert.strictEqual(res.status, 404, 'Expected status 404 for invalid city');
    const data = await res.json();
    assert.ok(data.error.includes('not found'), 'Expected error about city not found');

    console.log('✅ testInvalidCity passed');
}

// New test: Short city name (example)
async function testShortCity() {
    const res = await fetch('http://localhost:3000/api/geonames?city=ny');
    // Depending on your API, you might expect an error or a valid response.
    // Adjust assertions below accordingly.
    if (res.status === 400 || res.status === 422) {
      console.log('✅ testShortCity passed with expected error status:', res.status);
    } else {
      // if your API accepts it, check response structure
      const data = await res.json();
      assert.ok(data.geonames !== undefined || data.city !== undefined, 'Expected geonames or city data');
      console.log('✅ testShortCity passed with data response');
    }
}

// New test: Non-alphabetic characters
async function testNonAlphabetic() {
  const res = await fetch('http://localhost:3000/api/geonames?city=123$%');
  assert.strictEqual(res.status, 404, 'Expected 404 status for non-alphabetic query');
  const data = await res.json();
  assert.ok(data.error.includes('not found') || data.error.includes('City not found'), 'Expected city not found error');
  console.log('✅ testNonAlphabetic passed');
}


// New test: Empty results
async function testEmptyResults() {
    const res = await fetch('http://localhost:3000/api/geonames?city=zzzzzzzz');
    if (res.status === 404) {
        console.log('✅ testEmptyResults passed with 404 status');
        return;
    }
    assert.strictEqual(res.status, 200, 'Expected status 200 or 404 for empty results');
    const data = await res.json();
    // Depending on your API, it might return empty array or 404 error
    if (Array.isArray(data)) {
        assert.strictEqual(data.length, 0, 'Expected empty array for unknown city prefix');
    }
    console.log('✅ testEmptyResults passed');
}

async function runTests() {
    console.log('Running GeoNames API tests...');
    await testValidCity();
    await testMissingCity();
    await testInvalidCity();

    // Run your new tests
    await testShortCity();
    await testNonAlphabetic();
    await testEmptyResults();

    console.log('All tests passed');
}

runTests().catch(err => {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
});
