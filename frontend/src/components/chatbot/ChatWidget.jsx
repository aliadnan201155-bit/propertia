import React, { useState, useRef } from 'react';
import ChatBot from './ChatBot';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState({ width: 420, height: 600 });
  const resizeState = useRef({ startX: 0, startY: 0, startWidth: 420, startHeight: 600, active: false });

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const startResize = (event) => {
    event.preventDefault();
    resizeState.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: size.width,
      startHeight: size.height,
      active: true,
    };
    window.addEventListener('pointermove', handleResize);
    window.addEventListener('pointerup', stopResize);
  };

  const handleResize = (event) => {
    if (!resizeState.current.active) return;

    const deltaX = event.clientX - resizeState.current.startX;
    const deltaY = event.clientY - resizeState.current.startY;

    setSize((prev) => ({
      width: Math.min(Math.max(resizeState.current.startWidth - deltaX, 320), window.innerWidth - 32),
      height: Math.min(Math.max(resizeState.current.startHeight - deltaY, 360), window.innerHeight - 32),
    }));
  };

  const stopResize = () => {
    resizeState.current.active = false;
    window.removeEventListener('pointermove', handleResize);
    window.removeEventListener('pointerup', stopResize);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-primary-600 text-white rounded-full p-7 shadow-xl hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Open chat"
        >
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          
          {/* Notification Badge (optional - can be used for unread messages)
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          </span> */}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 animate-slideUp bg-transparent"
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            minWidth: '320px',
            minHeight: '360px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 32px)',
          }}
        >
          <div className="relative h-full w-full rounded-none shadow-2xl overflow-hidden bg-white">
             <button
              type="button"
              onPointerDown={startResize}
              className="absolute left-4 top-4 text-white hover:bg-white/20 rounded-full p-1.5 transition-colors duration-200 cursor-nwse-resize z-50"
              title="Drag to resize"
            >

            <svg className="w-5 h-5" strokeWidth="2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              
              <polyline points="16 8 20 8 20 12" />
              <polyline points="8 16 4 16 4 12" />
              <line x1="20" y1="8" x2="14" y2="14" />
              <line x1="4" y1="16" x2="10" y2="10" />

          </svg>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <polyline points="16 8 20 8 20 12" />
                <polyline points="8 16 4 16 4 12" />
                <line x1="20" y1="8" x2="14" y2="14" />
                <line x1="4" y1="16" x2="10" y2="10" />
              </svg> */}
            </button>
            <ChatBot onClose={toggleChat} />
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Mobile responsiveness */
        @media (max-width: 640px) {
          .fixed.bottom-6.right-6.w-full {
            bottom: 0;
            right: 0;
            left: 0;
            max-width: 100%;
            height: 100vh;
            border-radius: 0;
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
