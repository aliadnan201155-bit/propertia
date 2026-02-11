import React from 'react';

const ChatMessage = ({ message, isUser }) => {
  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 animate-fadeIn`}
    >
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-lg shadow-sm ${
          isUser
            ? 'bg-primary-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-line break-words">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
