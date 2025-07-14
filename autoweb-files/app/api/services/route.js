import { query } from '../db';

export async function GET() {
    try {
        const result = await query(`
            SELECT category, 
                   json_agg(json_build_object(
                       'id', id,
                       'name', name,
                       'price', price_low || '-' || price_high,
                       'description', description
                   )) as items
            FROM services 
            GROUP BY category
            ORDER BY category
        `);

        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch services' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
