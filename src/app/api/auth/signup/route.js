import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const mysql = await import("mysql2/promise");
    const db = await mysql.createPool(process.env.DATABASE_URL);

    const { id, email, username } = await req.json();

    if (!id || !email || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const [existing] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

    if (existing.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    // Insert new user
    await db.query("INSERT INTO users (id, email, username) VALUES (?, ?, ?)", [
      id,
      email,
      username,
    ]);

    return NextResponse.json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Signup error:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}