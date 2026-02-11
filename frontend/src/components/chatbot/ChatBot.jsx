import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { sendChatMessage } from '../../services/chatbotService';

const ChatBot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message on load
    const welcomeMessage = "👋 Assalamu Alaikum! I'm RoofrBot, your friendly property assistant. Tell me what you're looking for and I'll help you find the perfect property! 🏠";
    setMessages([{ text: welcomeMessage, isUser: false }]);
  }, []);

  const handleSendMessage = async (message) => {
    // Add user message
    setMessages((prev) => [...prev, { text: message, isUser: true }]);
    
    // Add loading message
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: '⏳ Searching...', isUser: false, isLoading: true }]);

    try {
      const data = await sendChatMessage(message);

      // Remove loading message
      setMessages((prev) => prev.filter((msg) => !msg.isLoading));

      if (data.success) {
        // Add bot reply
        setMessages((prev) => [...prev, { text: data.reply, isUser: false }]);

        // Add property results if available
        if (data.results && data.results.length > 0) {
          data.results.forEach((result) => {
            const propertyText = `${result.option}. ${result.title}\n💰 Rs. ${(result.price / 1000000).toFixed(1)}M\n🛏️ ${result.rooms} Beds | ${result.type}`;
            setMessages((prev) => [...prev, { text: propertyText, isUser: false }]);
          });
        }

        // Add admin contact if no results
        if (data.adminContact) {
          setTimeout(() => {
            const contactMsg = `📞 **Contact Our Team:**\n📧 ${data.adminContact.email}\n📱 ${data.adminContact.phone}\n\nWe're here to help! 😊`;
            setMessages((prev) => [...prev, { text: contactMsg, isUser: false }]);
          }, 500);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { text: `❌ Error: ${data.error || 'Unknown error'}`, isUser: false }
        ]);
      }
    } catch (error) {
      // Remove loading message
      setMessages((prev) => prev.filter((msg) => !msg.isLoading));
      
      setMessages((prev) => [
        ...prev,
        { text: `⚠️ Connection error: ${error.message}`, isUser: false }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-5 py-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h3 className="font-semibold text-lg">RoofrBot</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors duration-200"
          aria-label="Close chat"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatBot;
