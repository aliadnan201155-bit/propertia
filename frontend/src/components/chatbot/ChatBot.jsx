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
    const welcomeMessage = "👋 Assalamu Alaikum! I'm PropX, your friendly property assistant. Tell me what you're looking for and I'll help you find the perfect property! 🏠";
    setMessages([{ text: welcomeMessage, isUser: false }]);
  }, []);

  const handleSendMessage = async (message, propertyId = null) => {
    // Agar user text message bhej raha hai to screen pe dikhao
    if (message) {
      setMessages((prev) => [...prev, { text: message, isUser: true }]);
    }
    
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: '⏳ Searching...', isUser: false, isLoading: true }]);

    try {
      const payload = propertyId ? { selectedPropertyId: propertyId } : message;
      const data = await sendChatMessage(payload);

      setMessages((prev) => prev.filter((msg) => !msg.isLoading));

      if (data.success) {
        // AI ka reply text
        if (data.reply) {
           setMessages((prev) => [...prev, { text: data.reply, isUser: false }]);
        }

        // Detailed View (Button click hone par)
        if (data.isDetailedView && data.selectedProperty) {
            setMessages((prev) => [...prev, { 
                text: "", 
                isUser: false, 
                detailedProperty: data.selectedProperty 
            }]);
        } 
        // List of properties (Search hone par)
        else if (data.results && data.results.length > 0) {
            setMessages((prev) => [...prev, { 
                text: "", 
                isUser: false, 
                properties: data.results 
            }]);
        }

        if (data.adminContact) {
          setTimeout(() => {
            const contactMsg = `📞 Contact Our Team:\n📧 ${data.adminContact.email}\n📱 ${data.adminContact.phone}\n\nWe're here to help! 😊`;
            setMessages((prev) => [...prev, { text: contactMsg, isUser: false }]);
          }, 500);
        }
      } else {
        setMessages((prev) => [...prev, { text: `❌ Error: ${data.error || 'Unknown error'}`, isUser: false }]);
      }
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => !msg.isLoading));
      setMessages((prev) => [...prev, { text: `⚠️ Connection error: ${error.message}`, isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-2xl">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white px-5 py-4 rounded-t-lg flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <h3 className="font-semibold text-xlg">PropX</h3>
        </div>
        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full p-1.5 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <ChatMessage 
             key={index} 
             message={msg.text} 
             isUser={msg.isUser} 
             properties={msg.properties}
             detailedProperty={msg.detailedProperty}
             onViewDetails={(id) => handleSendMessage(null, id)}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={(msg) => handleSendMessage(msg)} disabled={isLoading} />
    </div>
  );
};

export default ChatBot;