export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const namePrefix = searchParams.get('namePrefix');

    try {
        const response = await fetch(
            `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${namePrefix}&limit=10`,
            {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
                    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
                },
            }
        );

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('GeoDB API error:', error);
        return new Response(
            JSON.stringify({ error: 'Error fetching data from GeoDB Cities API' }),
            { status: 500 }
        );
    }
}
