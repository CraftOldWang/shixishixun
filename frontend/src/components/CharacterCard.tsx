import React from "react";
import type { Character } from "../types";

interface CharacterCardProps {
    character: Character;
    onClick: (character: Character) => void;
    highlightColor?: string; // 可选：用于区分默认/自定义角色
}

const CharacterCard: React.FC<CharacterCardProps> = ({
    character,
    onClick,
    highlightColor,
}) => (
    <div
        onClick={() => onClick(character)}
        style={{
            border: "1px solid #eee",
            borderRadius: "12px",
            height: "320px",
            width: "140px",
            cursor: "pointer",
            background: highlightColor || "#f0fdf4",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "16px",
            marginRight: "16px",
        }}
    >
        {character.avatar && (
            <img
                src={character.avatar}
                alt={character.name}
                style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    marginBottom: "8px",
                }}
            />
        )}
        <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#6366f1" }}>
            {character.name}
        </h3>
        <p
            style={{
                fontSize: "12px",
                color: "#666",
                textAlign: "center",
                margin: "8px 0",
            }}
        >
            {character.description}
        </p>
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                justifyContent: "center",
            }}
        >
            {character.tags &&
                character.tags.map((t, idx) => (
                    <span
                        key={idx}
                        style={{
                            fontSize: "10px",
                            background: "#bbf7d0",
                            borderRadius: "4px",
                            padding: "2px 6px",
                        }}
                    >
                        {t}
                    </span>
                ))}
        </div>
    </div>
);

export default CharacterCard;