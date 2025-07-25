import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { GET } from "@/app/api/geonames/route";

test("integration: returns real city data from GeoNames", async () => {
  const city = "Vancouver";
  const req = new Request(`http://localhost/api/geonames?city=${city}`);

  const res = await GET(req);
  const json = await res.json();

  console.log("API response status:", res.status);
  console.log("API response body:", json);

  expect(res.status).toBe(200);
  expect(json.city).toBe("Vancouver");
  expect(typeof json.population).toBe("number");
  expect(typeof json.timezone).toBe("string");
});