import React from 'react';
import type { Character } from '../types';

interface CharacterAvatarProps {
  character: Character;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ character }) => {
  // 默认头像，如果没有提供角色头像
  const defaultAvatar = 'https://via.placeholder.com/300x500?text=Character';

  return (
    <div>
      <img
        src={character.avatar || defaultAvatar}
        alt={character.name}
      />
      <div>
        <h2>{character.name}</h2>
      </div>
    </div>
  );
};

export default CharacterAvatar;