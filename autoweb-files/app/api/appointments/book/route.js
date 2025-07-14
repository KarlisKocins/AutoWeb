import { pool } from '../../db'; // Import the DB connection pool

export async function POST(request) {
    try {
        const {
            client_id,
            service_id,
            car_details,
            appointment_date,
            appointment_time,
            notes,
        } = await request.json();

        // Validate required fields
        if (!client_id || !appointment_date || !appointment_time || !car_details.make || !car_details.license_plate) {
            return new Response(JSON.stringify({ 
                error: 'Trūkst obligāto lauku' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { make, model, year, VIN, license_plate } = car_details;
        
        // Start a transaction
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Insert car
            const carResult = await client.query(
                'INSERT INTO cars (make, model, year, VIN, license_plate) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [make, model || null, year || null, VIN || null, license_plate]
            );
            
            const car_id = carResult.rows[0].id;
            const status = "pending";

            // Insert appointment
            const appointmentResult = await client.query(
                'INSERT INTO appointments (client_id, service_id, car_id, appointment_date, appointment_time, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [client_id, service_id, car_id, appointment_date, appointment_time, status, notes]
            );

            await client.query('COMMIT');

            return new Response(JSON.stringify({
                message: 'Rezervācija veiksmīgi izveidota',
                appointment: appointmentResult.rows[0],
            }), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Error booking appointment:', error);
        return new Response(JSON.stringify({ 
            error: 'Rezervācija neizdevās', 
            details: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
