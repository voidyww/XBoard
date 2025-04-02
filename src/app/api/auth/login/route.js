import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const mysql = await import("mysql2/promise");
    const db = await mysql.createPool(process.env.DATABASE_URL);

    const { firebaseUid } = await req.json();

    if (!firebaseUid) {
      return NextResponse.json({ error: "Missing Firebase UID" }, { status: 400 });
    }

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
