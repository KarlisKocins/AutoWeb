import { pool } from '../../db'; // Importing the database connection

export async function GET(req) {
    try {
        // Extract the date parameter from the query string
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');

        if (!date) {
            return new Response(JSON.stringify({ 
                    error: 'Date parameter is required' 
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        // Query - only block times for pending or approved appointments
        const result = await pool.query(
            `SELECT appointment_time 
             FROM appointments 
             WHERE appointment_date = $1 AND status IN ('pending', 'approved')`,
            [date]
        );

        // Format the times to match the frontend format (HH:MM)
        const formattedTimes = result.rows.map(row => {
            const time = new Date(`1970-01-01T${row.appointment_time}`);
            return time.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        });

        // Return times in an array
        return new Response(JSON.stringify(formattedTimes), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching appointment times:', error);
        return new Response(JSON.stringify({ 
                error: 'Failed to fetch appointment times' 
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}