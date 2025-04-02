import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Lolzofive123!",
    database: process.env.DB_NAME || "disboard",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
