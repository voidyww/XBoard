import { NextResponse } from "next/server";
import { auth } from "@/utils/firebaseAdmin";
import { db } from "@/utils/db";

export async function POST(req) {
    try {
        const { email, password, username } = await req.json();

        if (!email || !password || !username) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Create Firebase user
        const user = await auth.createUser({ email, password });

        // Insert into MySQL
        const query = "INSERT INTO users (id, email, username) VALUES (?, ?, ?)";
        await db.query(query, [user.uid, email, username]);

        return NextResponse.json({ message: "User created successfully!", uid: user.uid });
    } catch (error) {
        console.error("❌ Signup error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
