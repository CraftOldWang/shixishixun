import React from 'react';

interface ChatOptionsProps {
  options: string[];
  onSelectOption: (option: string) => void;
  disabled: boolean;
}

const ChatOptions: React.FC<ChatOptionsProps> = ({ options, onSelectOption, disabled }) => {
  return (
    <div>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelectOption(option)}
          disabled={disabled}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ChatOptions;