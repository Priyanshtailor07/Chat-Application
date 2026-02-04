import React from 'react';
import { useSelector } from 'react-redux';

const MessageContainer = () => {
  const { selectedChat } = useSelector((state) => state.chat);

  if (!selectedChat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">💬</div>
        <p className="text-lg">Select a friend to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md">
        <div className="w-8 h-8 rounded-full bg-blue-500" />
        <span className="text-white font-bold">{selectedChat.username}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Messages will be mapped here */}
      </div>
      <div className="p-4 bg-slate-900/80 border-t border-white/10">
        <input type="text" placeholder="Type a message..." className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none" />
      </div>
    </div>
  );
};

export default MessageContainer;