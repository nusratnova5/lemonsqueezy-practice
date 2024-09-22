import dbConnect, { pool } from "@/utils/dbConnect";
dbConnect();

export async function POST(req) {
    try {
        const reqData = await req.json();

        // Extract data from the request
        const { user_id, product_id, amount, status } = reqData;

        // Validate required fields
        if (!user_id || !product_id || !amount || !status) {
            console.log('User ID, Product ID, Amount, and Status are required');
            return new Response.json({ message: 'All fields are required' }, { status: 400 });
        }

        try {
            // Insert new transaction into the database
            const newTransaction = await pool.query(
                'INSERT INTO transactions (user_id, product_id, amount, status) VALUES ($1, $2, $3, $4) RETURNING *',
                [user_id, product_id, amount, status]
            );
            console.log('New transaction added:', newTransaction.rows[0]);

            return Response.json(newTransaction.rows[0], { status: 201 });
        } catch (err) {
            console.error('Database insertion error:', err);
            return Response.json({ message: 'Database insertion error' }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return Response.json({ message: 'An error occurred' }, { status: 500 });
    }
}
