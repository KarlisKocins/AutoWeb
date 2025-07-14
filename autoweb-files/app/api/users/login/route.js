import bcrypt from 'bcryptjs';
import { query } from '../../db';

export async function POST(req) {
    try {
    const { username, password } = await req.json();

    // Check if the required fields are provided
    if (!username || !password) {
        return new Response(JSON.stringify({ error: 'Missing username or password' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Check if the username exists
    const checkUsername = await query('SELECT * FROM user_profiles WHERE username = $1', [username]);
    if (checkUsername.rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const user = checkUsername.rows[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
        return new Response(JSON.stringify({ error: 'Invalid username or password' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Successful login
    const { password_hash, ...userData } = user
    console.log("test login source");
    return new Response(JSON.stringify({ message: 'Login successful', user: userData }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
    } catch (error) {
        console.error('Login Error:', error);
        return new Response(JSON.stringify({ error: 'Login failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}