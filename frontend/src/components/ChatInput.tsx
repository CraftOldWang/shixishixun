import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={disabled}
        placeholder="输入你想说的话..."
        className="
          flex-1 p-3 rounded-full 
          bg-black bg-opacity-60 backdrop-blur-md text-white
          border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          placeholder-gray-400
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`
          p-3 rounded-full 
          bg-blue-600 text-white
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${!message.trim() || disabled ? '' : 'hover:bg-blue-700 hover:scale-105'}
        `}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;