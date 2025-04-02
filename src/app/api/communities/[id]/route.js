import { NextResponse } from "next/server";

// DELETE a community
export async function DELETE(req, { params }) {
  try {
    const mysql = await import("mysql2/promise");
    const db = await mysql.createPool(process.env.DATABASE_URL);

    const { id } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const [results] = await db.query("SELECT owner_id FROM servers WHERE id = ?", [id]);

    if (results.length === 0) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    if (results[0].owner_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.query("DELETE FROM servers WHERE id = ?", [id]);

    return NextResponse.json({ message: "Community deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting community:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// PUT to update a community
export async function PUT(req, { params }) {
  try {
    const mysql = await import("mysql2/promise");
    const db = await mysql.createPool(process.env.DATABASE_URL);

    const { id } = params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const { description, tags } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const [results] = await db.query("SELECT owner_id FROM servers WHERE id = ?", [id]);
    if (results.length === 0) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    if (results[0].owner_id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await db.query("UPDATE servers SET description = ? WHERE id = ?", [description, id]);

    await db.query("DELETE FROM server_tags WHERE server_id = ?", [id]);

    if (Array.isArray(tags)) {
      for (const tag of tags) {
        const trimmed = tag.trim();
        if (trimmed) {
          await db.query(
            "INSERT INTO tags (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name",
            [trimmed]
          );

          const [tagResult] = await db.query("SELECT id FROM tags WHERE name = ?", [trimmed]);

          if (tagResult.length > 0) {
            await db.query(
              "INSERT INTO server_tags (server_id, tag_id) VALUES (?, ?)",
              [id, tagResult[0].id]
            );
          }
        }
      }
    }

    return NextResponse.json({ message: "Community updated successfully!" });
  } catch (error) {
    console.error("❌ Error updating community:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
