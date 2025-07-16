import React from 'react';

interface ChatOptionsProps {
  options: string[];
  onSelectOption: (option: string) => void;
  disabled: boolean;
}

const ChatOptions: React.FC<ChatOptionsProps> = ({ options, onSelectOption, disabled }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelectOption(option)}
          disabled={disabled}
          className={`
            bg-black bg-opacity-60 backdrop-blur-md text-white 
            px-4 py-2 rounded-full text-sm
            transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80 hover:scale-105'}
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ChatOptions;