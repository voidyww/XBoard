import { NextResponse } from "next/server";
const mysql = await import("mysql2/promise");
const db = await mysql.createPool(process.env.DATABASE_URL);

export async function POST(req) {
    try {
        const { firebaseUid, email, username } = await req.json();
        if (!firebaseUid || !email || !username) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Store Firebase UID in MySQL
        await db.query("INSERT INTO users (id, email, username) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE username = VALUES(username)", 
            [firebaseUid, email, username]);

        return NextResponse.json({ message: "User saved successfully!" }, { status: 201 });
    } catch (error) {
        console.error("❌ Signup error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}


