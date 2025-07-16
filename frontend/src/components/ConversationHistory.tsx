import React from 'react';
import type { Message } from '../types';

interface ConversationHistoryProps {
  messages: Message[];
  characterName: string;
  onClose: () => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ 
  messages, 
  characterName,
  onClose 
}) => {
  return (
    <div className="fixed inset-y-0 left-0 w-80 bg-black bg-opacity-70 backdrop-blur-md text-white p-4 overflow-y-auto z-10 transition-all duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">与{characterName}的对话历史</h2>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">暂无对话记录</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="border-b border-gray-700 pb-2">
              <div className="flex items-center mb-1">
                <span className="font-medium">
                  {message.isUser ? '你' : characterName}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(message.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;