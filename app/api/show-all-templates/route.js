import dbConnect, { pool } from '@/utils/dbConnect';
import React from 'react';

export async function GET() {
    await dbConnect();

    let result = [];
    try {
        const data = await pool.query("SELECT * FROM templates");
        result = data.rows;
    } catch (err) {
        console.error('Error fetching data from database:', err);
    }
    
    return Response.json(result, {status: 200});
}