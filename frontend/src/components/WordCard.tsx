import React from "react";
import type { Wordcard } from "../types";
import { Volume2, Trash2 } from "lucide-react";

interface WordCardProps {
  wordCard: Wordcard;
  onRemove: (id: string) => void;
}

const WordCard: React.FC<WordCardProps> = ({ wordCard, onRemove }) => {
  const handleAudioPlay = () => {
    const audio = new Audio(`https://api.dictionaryapi.dev/media/pronunciations/en/${wordCard.word}-us.mp3`);
    audio.play().catch(e => console.error("播放失败:", e));
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-md hover:shadow-xl transition-all flex flex-col h-full">
      {/* 单词标题和音频按钮 */}
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-800">{wordCard.word}</h3>
        <button
          onClick={handleAudioPlay}
          className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
          aria-label="播放发音"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
      
      {/* 音标 */}
      <div className="mt-2 text-gray-600">
        [{wordCard.pronunciation || "音标未提供"}]
      </div>
      
      {/* 词性和释义 */}
      <div className="mt-3 flex-grow">
        <div className="flex items-baseline">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mr-2">
            {wordCard.pos || "n."}
          </span>
          <p className="text-gray-700">
            {wordCard.context || "释义未提供"}
          </p>
        </div>
      </div>
      
      {/* 来源信息 */}
      <div className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
        <div>收藏于: {new Date(wordCard.createdAt).toLocaleDateString()}</div>
        <div className="truncate">来源消息: {wordCard.messageId || "未知"}</div>
      </div>
      
      {/* 取消收藏按钮 */}
      <button
        onClick={() => onRemove(wordCard.id)}
        className="mt-4 flex items-center justify-center w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        取消收藏
      </button>
    </div>
  );
};

export default WordCard;

