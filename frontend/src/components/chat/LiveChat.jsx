import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../../sockets/socket';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Welcome to SecureLogix! How can we help you today?", sender: 'agent', id: 'system' }
  ]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);
  const isOpenRef = useRef(isOpen);

  // Keep ref in sync with state to use inside socket listener
  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) {
      setUnreadCount(0); // Clear unread count when opening
    }
  }, [isOpen]);

  useEffect(() => {
    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
      
      // If the message is not from us, and the chat is closed, increment unread count
      if (msg.id !== socket.id && !isOpenRef.current) {
        setUnreadCount((prev) => prev + 1);
        
        // Optional: play a sound here
        // new Audio('/notification.mp3').play().catch(() => {});
      }
    };

    socket.on('chatMessage', handleNewMessage);

    return () => {
      socket.off('chatMessage', handleNewMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { text: input, sender: 'user', id: socket.id };
    socket.emit('chatMessage', newMsg);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* Chat Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="relative bg-[#BAAB48] hover:bg-white text-[#111] p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
        >
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 border-2 border-[#111] text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-[#111] border border-[#333] w-80 sm:w-96 rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[500px] max-h-[80vh] transition-all">
          {/* Header */}
          <div className="bg-[#1a1a1a] p-4 border-b border-[#333] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="text-white font-bold uppercase tracking-widest text-sm">Live Support</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[#A9A9A9] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent">
            {messages.map((msg, idx) => {
              const isMe = msg.id === socket.id;
              
              return (
                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 text-sm ${isMe ? 'bg-[#BAAB48] text-[#111]' : 'bg-[#222] text-[#ccc]'}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#1a1a1a] border-t border-[#333]">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-[#222] border border-[#333] text-white px-3 py-2 text-sm outline-none focus:border-[#BAAB48] transition-colors rounded-none placeholder:text-[#666]"
              />
              <button 
                type="submit"
                className="bg-[#BAAB48] hover:bg-white text-[#111] px-4 py-2 font-bold uppercase tracking-widest text-[10px] transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
