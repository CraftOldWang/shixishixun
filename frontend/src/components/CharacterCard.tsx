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
    <div onClick={() => onClick(character)}>
        {character.avatar && (
            <img src={character.avatar} alt={character.name} />
        )}
        <h3>{character.name}</h3>
        <p>{character.description}</p>
        <div>
            {character.tags &&
                character.tags.map((t, idx) => (
                    <span key={idx}>{t}</span>
                ))}
        </div>
    </div>
);

export default CharacterCard;