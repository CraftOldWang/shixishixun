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
        <span onClick={(e) => handleWordClick(e, word)}>{word}</span>
        {index < words.length - 1 ? ' ' : ''}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <div>{renderMessageContent()}</div>

      {/* 单词弹窗 */}
      {selectedWord && wordDefinition && (
        <div ref={popupRef} style={{ top: `${popupPosition.top}px`, left: `${popupPosition.left}px` }}>
          {isLoading ? (
            <p>加载中...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <div>
                <h3>{wordDefinition.word}</h3>
                <button onClick={handleSaveWord}>保存</button>
              </div>
              <p>{wordDefinition.definition}</p>
              {wordDefinition.examples && wordDefinition.examples.length > 0 && (
                <div>
                  <p>{wordDefinition.examples[0]}</p>
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