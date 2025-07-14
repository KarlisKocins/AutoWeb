import { pool } from '../../db';

export async function POST(request) {
    try {
        const { appointment_id, status } = await request.json();

        if (!appointment_id || !status) {
            return new Response(
                JSON.stringify({ 
                    error: 'appointment_id and status are required'
                }),{ 
                    status: 400, 
                    headers: { 'Content-Type': 'application/json' } 
                }
            );
        }

        // Update status
        const result = await pool.query(
            `UPDATE appointments 
             SET status = $1, updated_at = NOW() 
             WHERE id = $2 
             RETURNING id, status`,
            [status, appointment_id]
        );

        // Check if the appointment exists
        if (result.rowCount === 0) {
            return new Response(JSON.stringify({ 
                error: 'Appointment not found' 
            }),{ 
                status: 404, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        // Return the updated appointment details
        return new Response(
            JSON.stringify({ 
                message: 'Appointment status updated', 
                appointment: result.rows[0] 
            }),{ 
                status: 200, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );
    } catch (error) {
        console.error('Error updating appointment:', error);
        return new Response(JSON.stringify({ 
                error: 'Internal server error'
            }),{ 
                status: 500, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );
    }
}