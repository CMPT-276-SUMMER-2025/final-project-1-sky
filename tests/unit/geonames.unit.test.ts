import { GET } from "@/app/api/geonames/route";
import { NextResponse } from "next/server";

global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

beforeEach(() => {
    mockFetch.mockReset();
});

test("returns 400 if city is missing", async () => {
    const req = new Request("http://localhost/api/geonames");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/Missing city/i);
});

test("returns city data when fetch is successful", async () => {
    const mockSearch = {
        geonames: [{
            lat: "45.5",
            lng: "-73.5",
            population: 1000000,
            name: "Montreal"
        }]
    };

    const mockTimezone = {
        timezoneId: "America/Toronto",
        time: "2025-07-24 15:00"
    };

    const mockElevation = {
        srtm3: 30
    };

    mockFetch
        .mockResolvedValueOnce({
            json: async () => mockSearch
        })
        .mockResolvedValueOnce({
            json: async () => mockTimezone
        })
        .mockResolvedValueOnce({
            json: async () => mockElevation
        });

    const req = new Request("http://localhost/api/geonames?city=Montreal");
    process.env.GEONAMES_USERNAME = "mockuser";

    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.city).toBe("Montreal");
    expect(json.timezone).toBe("America/Toronto");
    expect(json.elevation).toBe(30);
});
