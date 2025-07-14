import bcrypt from 'bcryptjs';
import { query } from '../../db';

export async function POST(req) {
    try {
        const { username, password, name, phone, role, email, identification_num } = await req.json();

        // Check if all required fields are provided
        if (!username || !password || !name || !phone || !role) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Check if the username already exists
        const checkUsername = await query('SELECT * FROM user_profiles WHERE username = $1', [username]);
        if (checkUsername.rows.length > 0) {
            return new Response(JSON.stringify({ error: 'Username already exists' }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const insertQuery = `
            INSERT INTO user_profiles (username, password_hash, name, phone, role, email, identification_num)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `;
        const values = [username, hashedPassword, name, phone, role, email || null, identification_num || null];
        const insertUser = await query(insertQuery, values);

        return new Response(JSON.stringify({ message: 'User registered successfully', userId: insertUser.rows[0].id }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Registration Error:', error);
        return new Response(JSON.stringify({ error: 'Registration failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}