import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, LogOut } from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { searchUsers,setSelectedChat  } from '../../redux/slices/chatSlice';    
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults, chats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 2) dispatch(searchUsers(e.target.value));
  };

  return (
    <div className="flex flex-col h-full p-4 glass">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white/20 flex items-center justify-center font-bold text-white">
            {user?.username?.[0].toUpperCase()}
          </div>
          <h2 className="font-bold text-white">My Chats</h2>
        </div>
        <LogOut className="text-slate-400 cursor-pointer hover:text-red-500 transition-colors" size={20} onClick={() => { dispatch(logout()); navigate('/login'); }} />
      </div>

      <div className="relative mb-6">
        <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Find someone..." className="w-full bg-white/5 border border-white/10 p-2 pl-10 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500" />
        <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {(searchTerm.length > 2 ? searchResults : chats).map((item) => (
          <div key={item._id} onClick={() => dispatch(setSelectedChat(item))} className="p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all border border-transparent hover:border-white/20">
            <p className="text-white font-medium text-sm">{item.username}</p>
            <p className="text-slate-500 text-xs">Click to message</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;