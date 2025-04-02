import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function POST(req) {
    try {
        const { firebaseUid } = await req.json();
        if (!firebaseUid) {
            return NextResponse.json({ error: "Missing Firebase UID" }, { status: 400 });
        }

        // Get user info from MySQL
        const [users] = await db.query("SELECT * FROM users WHERE id = ?", [firebaseUid]);
        if (users.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = users[0];

        return NextResponse.json({ message: "Login successful!", user });
    } catch (error) {
        console.error("❌ Login error:", error);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}
