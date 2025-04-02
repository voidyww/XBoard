import { NextResponse } from "next/server";

export async function GET() {
  try {
    const mysql = await import("mysql2/promise");
    const db = await mysql.createPool(process.env.DATABASE_URL);

    const query = `
      SELECT s.*, GROUP_CONCAT(t.name) AS tags
      FROM servers s
      LEFT JOIN server_tags st ON s.id = st.server_id
      LEFT JOIN tags t ON st.tag_id = t.id
      GROUP BY s.id
    `;

    const [results] = await db.query(query);

    const serversWithTags = results.map(server => ({
      ...server,
      tags: server.tags ? server.tags.split(",") : [],
      image_url: server.image_url || null
    }));

    return NextResponse.json(serversWithTags);
  } catch (error) {
    console.error("❌ Error fetching servers:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
