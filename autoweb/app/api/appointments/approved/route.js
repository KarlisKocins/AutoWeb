import { pool } from '../../db';

export async function GET() {
    try {
        const result = await pool.query(
            `SELECT 
                a.id AS id, 
                u.name,
                u.phone,
                s.name AS service_name,
                c.license_plate,
                TO_CHAR(a.appointment_date, 'DD.MM.YYYY') AS date, 
                TO_CHAR(a.appointment_time, 'HH24:MI') AS time,
                a.status
            FROM appointments a
            JOIN user_profiles u ON a.client_id = u.id
            JOIN cars c ON a.car_id = c.id
            LEFT JOIN services s ON a.service_id = s.id
            WHERE a.status IN ('approved', 'completed')
            ORDER BY a.appointment_date ASC, a.appointment_time ASC
            LIMIT 10`
        );

        return new Response(JSON.stringify(result.rows), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching approved appointments:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch approved appointments' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}