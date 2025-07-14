import { pool } from '../../db'; 

export async function GET() {
    try {
        // Query
        const result = await pool.query(
            `SELECT 
                a.id AS id, 
                u.name,
                u.phone,
                u.email,
                s.name AS service_name,
                s.category AS service_category,
                c.make,
                c.model,
                c.year,
                c.VIN,
                c.license_plate, 
                TO_CHAR(a.appointment_date, 'DD.MM.YYYY') AS date, 
                TO_CHAR(a.appointment_time, 'HH24:MI') AS time,
                a.notes
            FROM appointments a
            JOIN user_profiles u ON a.client_id = u.id
            JOIN cars c ON a.car_id = c.id
            LEFT JOIN services s ON a.service_id = s.id
            WHERE a.status = 'pending'
            ORDER BY a.appointment_date ASC, a.appointment_time ASC`
        );

        if (result.rows.length > 0) {
            return new Response(JSON.stringify(
                result.rows
            ), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            // No results, return empty array
            return new Response(JSON.stringify(
                []
            ), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return new Response(
            JSON.stringify({ 
                error: 'Failed to fetch appointments' 
            }),{
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}