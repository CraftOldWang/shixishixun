import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { useWordLookup } from '../hooks/useWordLookup';

interface MessageBubbleProps {
  message: Message;
  conversationId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, conversationId }) => {
  const {
    selectedWord,
    wordDefinition,
    isLoading,
    error,
    lookupSelectedWord,
    saveWordToWordbook,
    clearSelectedWord
  } = useWordLookup();

  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  // 处理单词点击
  const handleWordClick = (e: React.MouseEvent, word: string) => {
    e.preventDefault();
    e.stopPropagation();

    // 清除标点符号
    const cleanWord = word.replace(/[.,!?;:"'()\[\]{}]/g, '');
    if (!cleanWord.trim()) return;

    // 设置弹窗位置
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    });

    // 查询单词
    lookupSelectedWord(cleanWord);
  };

  // 处理保存单词
  const handleSaveWord = () => {
    if (selectedWord && wordDefinition) {
      saveWordToWordbook(conversationId, message.content);
    }
  };

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        clearSelectedWord();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [clearSelectedWord]);

  // 将消息内容分割成单词，以便点击
  const renderMessageContent = () => {
    if (message.isUser) {
      return message.content;
    }

    // 只对AI消息进行单词处理
    const words = message.content.split(/\s+/);
    return words.map((word, index) => (
      <React.Fragment key={index}>
        <span 
          className="cursor-pointer hover:bg-blue-100 rounded px-0.5"
          onClick={(e) => handleWordClick(e, word)}
        >
          {word}
        </span>
        {index < words.length - 1 ? ' ' : ''}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[70%] p-3 rounded-lg ${message.isUser 
          ? 'bg-blue-500 text-white rounded-tr-none' 
          : 'bg-black bg-opacity-60 backdrop-blur-md text-white rounded-tl-none'}`}
      >
        {renderMessageContent()}
      </div>

      {/* 单词弹窗 */}
      {selectedWord && wordDefinition && (
        <div 
          ref={popupRef}
          className="absolute bg-white rounded-lg shadow-lg p-4 z-10 w-64"
          style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}
        >
          {isLoading ? (
            <p>加载中...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg">{wordDefinition.word}</h3>
                <button 
                  onClick={handleSaveWord}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-700">{wordDefinition.definition}</p>
              {wordDefinition.examples && wordDefinition.examples.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 italic">{wordDefinition.examples[0]}</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;