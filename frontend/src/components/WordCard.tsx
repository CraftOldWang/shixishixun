import React from "react";
import type { WordCard } from "../types"; // Adjust the import path as needed

interface WordCardProps {
  wordCard: WordCard;
  onRemove: (id: string) => void; // Function to handle removal of the word from favorites
}

const WordCard: React.FC<WordCardProps> = ({ wordCard, onRemove }) => {
  const handleAudioPlay = () => {
    const audio = new Audio(`https://api.dictionaryapi.dev/media/pronunciations/en/${wordCard.word}-us.mp3`);
    audio.play();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all">
      {/* Word */}
      <div className="text-xl font-bold text-gray-800">{wordCard.word}</div>
      
      {/* Phonetic symbol with audio play button */}
      <div className="flex items-center mt-2 text-gray-600">
        <span className="mr-2">[{wordCard.pronunciation ? wordCard.pronunciation : "音标"}]</span>
        <button
          onClick={handleAudioPlay}
          className="text-blue-600 hover:text-blue-700"
        >
          🔊
        </button>
      </div>
      
      {/* Part of speech and definition */}
      <div className="mt-2 text-sm text-gray-700">
        <span className="font-semibold">{wordCard.pos || "词性"}</span>: {wordCard.context || "释义未提供"}
      </div>
      
      {/* Source message */}
      <div className="mt-2 text-xs text-gray-500">
        来自消息：{wordCard.messageId || "消息未知"}
      </div>
      
      {/* Remove from favorites button */}
      <div className="mt-4">
        <button
          onClick={() => onRemove(wordCard.id)}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          取消收藏
        </button>
      </div>
    </div>
  );
};

export default WordCard;

