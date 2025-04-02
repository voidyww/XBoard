"use client";
import React, { useEffect, useState } from "react";
import { Vibrant } from "@vibrant/core";

interface Props {
  server: {
    id: string;
    name: string;
    description: string;
    image_url?: string;
    invite_link?: string;
    tags: string[];
  };
}

const CommunityCard: React.FC<Props> = ({ server }) => {
  const [bgColor, setBgColor] = useState("#999");

  useEffect(() => {
    if (!server.image_url) return;

    const fetchColor = async () => {
      try {
        const palette = await Vibrant.from(server.image_url as string).getPalette();
        if (palette.Vibrant) {
          setBgColor(palette.Vibrant.hex);
        }
      } catch (err) {
        console.error("Vibrant error:", err);
      }
    };

    fetchColor();
  }, [server.image_url]);

  return (
    <div
      className="server-card"
      style={{
        background: `linear-gradient(to bottom, ${bgColor}, transparent)`,
      }}
    >
      {server.image_url && (
        <img
          src={server.image_url}
          alt={server.name}
          className="community-image"
          crossOrigin="anonymous"
        />
      )}

      <div className="price-tag"></div>
      <h3>{server.name}</h3>
      <p>{server.description}</p>
      <div className="tags">
        {server.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div>
      <a
        href={server.invite_link || server.image_url}
        target="_blank"
        rel="noopener noreferrer"
        className="join-link"
      >
        Join
      </a>
    </div>
  );
};

export default CommunityCard;
