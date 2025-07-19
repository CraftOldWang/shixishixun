import type { FC } from 'react';
import type { Character } from "../types";

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
}

const CharacterCard: FC<CharacterCardProps> = ({ character, onClick }) => (
<div
    onClick={onClick}
    className="relative w-64 h-80 rounded-xl overflow-hidden shadow-md cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
>
    {/* 背景图 */}
    <img
        className="w-full h-full object-cover"
        src={character.avatar || 'https://via.placeholder.com/400x320/EFEFEF/AAAAAA?text=No+Image'}
        alt={character.name}
    />

    {/* 底部信息浮层 */}
    <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white p-4 z-10">
        {/* 名字 */}
        <h3 className="font-bold text-lg truncate">{character.name}</h3>

        {/* 描述（最多两行） */}
        <p className="text-sm mt-1 line-clamp-2 text-gray-200">
            {character.description}
        </p>

        {/* tags */}
        {character.tags && character.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
                {character.tags.map(tag => (
                    <span
                        key={tag}
                        className="px-2 py-0.5 bg-white/20 text-white text-xs font-semibold rounded-full backdrop-blur-sm"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        )}
    </div>
</div>
);


export default CharacterCard;
