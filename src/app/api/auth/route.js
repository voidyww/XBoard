import { NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export async function POST(req) {
  try {
    // ✅ Parse Firebase credentials from env
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_JSON);

    // ✅ Dynamically initialize Firebase Admin if not already
    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }

    const auth = getAuth();

    const mysql = await import("mysql2/promise");
    const db = await mysql.createPool(process.env.DATABASE_URL);

    const { email, password, username } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // ✅ Create Firebase user
    const user = await auth.createUser({ email, password });

    // ✅ Store user in MySQL
    const query = "INSERT INTO users (id, email, username) VALUES (?, ?, ?)";
    await db.query(query, [user.uid, email, username]);

    return NextResponse.json({ message: "User created successfully!", uid: user.uid });
  } catch (error) {
    console.error("❌ Signup error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
