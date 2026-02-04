import React from 'react';
import Sidebar from './Sidebar';
import MessageContainer from './MessageContainer';

const ChatPage = () => {
  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden font-sans">
      <div className="w-full md:w-80 h-full border-r border-white/10">
        <Sidebar />
      </div>
      <div className="flex-1 h-full bg-slate-900/30">
        <MessageContainer />
      </div>
    </div>
  );
};

export default ChatPage;