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
    <div>
      <div>
        <h2>与{characterName}的对话历史</h2>
        <button onClick={onClose}>关闭</button>
      </div>
      
      <div>
        {messages.length === 0 ? (
          <p>暂无对话记录</p>
        ) : (
          messages.map((message) => (
            <div key={message.id}>
              <div>
                <span>{message.isUser ? '你' : characterName}</span>
                <span>{new Date(message.timestamp).toLocaleString()}</span>
              </div>
              <p>{message.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;