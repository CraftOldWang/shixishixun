import React from 'react';
import type { Character } from '../types';

interface CharacterAvatarProps {
  character: Character;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ character }) => {
  // 默认头像，如果没有提供角色头像
  const defaultAvatar = 'https://via.placeholder.com/300x500?text=Character';
  
  return (
    <div className="relative h-full">
      <img
        src={character.avatar || defaultAvatar}
        alt={character.name}
        className="h-full object-contain"
      />
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <h2 className="text-xl font-bold text-white bg-black bg-opacity-50 inline-block px-4 py-2 rounded-full">
          {character.name}
        </h2>
      </div>
    </div>
  );
};

export default CharacterAvatar;