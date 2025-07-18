import React from "react";
import type { FC } from 'react';
import type { Character } from "../types";

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
}

const CharacterCard: FC<CharacterCardProps> = ({ character, onClick }) => (
    <div
        onClick={onClick}
        className="group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
    >
        {/* 角色图片 */}
        {/* avatar is optional, so we provide a fallback placeholder */}
        <img
            className="w-full h-40 object-cover"
            src={character.avatar || 'https://via.placeholder.com/400x260/EFEFEF/AAAAAA?text=No+Image'}
            alt={character.name}
        />
        {/* 角色信息 */}
        <div className="p-4">
            {/* 名字 */}
            <h3 className="font-bold text-lg text-gray-800">{character.name}</h3>
            {/* 设定(描述) */}
            {/* TODO 如果设定太长了会不会有什么显示bug？也许应该使用省略号？但是那样的话，点击角色之后应该要
              显示角色设定的 */}
            <p className="text-sm text-gray-500 mt-1">{character.description}</p>
            {/* tags */}
            {/* TODO 是否有办法让tags能贴着卡片下边沿，不然不同卡片显示得有点不一样。 */}
            {character.tags && character.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {character.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
        </div>
    </div>
);


export default CharacterCard;
