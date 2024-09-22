import { Pool } from "pg";

const dbObj = {
    user: process.env.USER_NAME,
    host: process.env.HOST_NAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.PORT_NUMBER,
}
console.log(dbObj);

export const pool = new Pool(dbObj)

export default async function dbConnect() {
    pool.connect((err, client, release) => {
        if (err) {
            return console.error("Error in connection", err.stack);
        }
        client.query("SELECT NOW()", (err, result) => {
            release();  // Always release the client back to the pool
            if (err) {
                return console.error("Error in query execution", err.stack);
            }
            console.log("Connected to database");
        });
    });
}