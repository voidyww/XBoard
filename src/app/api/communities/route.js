import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    let query;
    let queryParams = [];

    if (userId) {
      // Fetch only the communities belonging to the logged-in user
      query = `SELECT s.*, GROUP_CONCAT(t.name) AS tags 
               FROM servers s 
               LEFT JOIN server_tags st ON s.id = st.server_id 
               LEFT JOIN tags t ON st.tag_id = t.id 
               WHERE s.owner_id = ? 
               GROUP BY s.id`;
      queryParams = [userId];
    } else {
      // Fetch all communities (fallback if no userId is provided)
      query = `SELECT s.*, GROUP_CONCAT(t.name) AS tags 
               FROM servers s 
               LEFT JOIN server_tags st ON s.id = st.server_id 
               LEFT JOIN tags t ON st.tag_id = t.id 
               GROUP BY s.id`;
    }

    const [results] = await db.query(query, queryParams);
    const communities = results.map(server => ({
      ...server,
      tags: server.tags ? server.tags.split(",") : [],
      image_url: server.image_url || null
    }));

    return NextResponse.json(communities);
  } catch (error) {
    console.error("❌ Error fetching communities:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, description, communityURL, tags, imageUrl, members, userId } = await req.json();

    if (!name || !description || !communityURL) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const query = `INSERT INTO servers (name, description, invite_link, image_url, owner_id, members) 
    VALUES (?, ?, ?, ?, ?, ?)`;
const [result] = await db.query(query, [name, description, communityURL, imageUrl, userId, 0]);


    const serverId = result.insertId;

    // Insert Tags
    if (tags && Array.isArray(tags)) {
      for (const tag of tags) {
        if (tag.trim() !== "") {
          await db.query("INSERT INTO tags (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name", [tag]);
          const [tagResult] = await db.query("SELECT id FROM tags WHERE name = ?", [tag]);
          if (tagResult.length > 0) {
            await db.query("INSERT INTO server_tags (server_id, tag_id) VALUES (?, ?)", 
                          [serverId, tagResult[0].id]);
          }
        }
      }
    }

    return NextResponse.json({ message: "Community added successfully!", id: serverId });
  } catch (error) {
    console.error("❌ Error creating community:", error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}