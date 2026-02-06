import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, LogOut, UserPlus, Check, X, MessageCircle } from "lucide-react";
import { logout } from "../../redux/slices/authSlice";
import {
  acceptFriendRequest,
  createChat,
  rejectFriendRequest,
  searchUsers,
  sendFriendRequest,
  setSelectedChat
} from "../../redux/slices/chatSlice";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults, chats, friends, requests, unreadCounts } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 2) dispatch(searchUsers(e.target.value));
  };

  const openChatWithFriend = async (friend) => {
    const result = await dispatch(createChat(friend.email));
    if (result?.payload?._id) dispatch(setSelectedChat(result.payload));
  };

  return (
    <div className="flex flex-col h-full p-4 glass">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/settings")}
            className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white/20 flex items-center justify-center font-bold text-white hover:brightness-110 transition"
            aria-label="Open settings"
          >
            {user?.username?.[0]?.toUpperCase()}
          </button>
          <h2 className="font-bold text-white">My Chats</h2>
        </div>
        <LogOut className="text-slate-400 cursor-pointer hover:text-red-500 transition-colors" size={20} onClick={() => { dispatch(logout()); navigate('/login'); }} />
      </div>

      <div className="relative mb-6">
        <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Find someone..." className="w-full bg-white/5 border border-white/10 p-2 pl-10 rounded-xl text-white outline-none focus:ring-1 focus:ring-blue-500" />
        <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {searchTerm.length > 2 && (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-slate-400">Search results</p>
            {searchResults.map((item) => (
              <div key={item._id} className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">{item.username}</p>
                    <p className="text-slate-500 text-xs">{item.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.isFriend ? (
                      <span className="text-xs text-green-400">Friends</span>
                    ) : item.requestReceived ? (
                      <button
                        type="button"
                        onClick={() => dispatch(acceptFriendRequest(item._id))}
                        className="p-2 rounded-lg bg-green-600 hover:bg-green-700"
                        aria-label="Accept request"
                      >
                        <Check size={16} className="text-white" />
                      </button>
                    ) : item.requestSent ? (
                      <span className="text-xs text-slate-400">Pending</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => dispatch(sendFriendRequest(item._id))}
                        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700"
                        aria-label="Send request"
                      >
                        <UserPlus size={16} className="text-white" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-400">Requests</p>
          {requests.received.length === 0 && (
            <p className="text-xs text-slate-500">No pending requests</p>
          )}
          {requests.received.map((req) => (
            <div key={req._id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-white font-medium text-sm">{req.username}</p>
                <p className="text-slate-500 text-xs">{req.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => dispatch(acceptFriendRequest(req._id))}
                  className="p-2 rounded-lg bg-green-600 hover:bg-green-700"
                  aria-label="Accept request"
                >
                  <Check size={16} className="text-white" />
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(rejectFriendRequest(req._id))}
                  className="p-2 rounded-lg bg-red-600 hover:bg-red-700"
                  aria-label="Reject request"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-400">Pending sent</p>
          {requests.sent.length === 0 && (
            <p className="text-xs text-slate-500">No sent requests</p>
          )}
          {requests.sent.map((req) => (
            <div key={req._id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-white font-medium text-sm">{req.username}</p>
                <p className="text-slate-500 text-xs">{req.email}</p>
              </div>
              <span className="text-xs text-slate-400">Pending</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-400">Friends</p>
          {friends.length === 0 && (
            <p className="text-xs text-slate-500">No friends yet</p>
          )}
          {friends.map((friend) => (
            <div key={friend._id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-white font-medium text-sm">{friend.username}</p>
                <p className="text-slate-500 text-xs">{friend.email}</p>
              </div>
              <button
                type="button"
                onClick={() => openChatWithFriend(friend)}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700"
                aria-label="Message friend"
              >
                <MessageCircle size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-400">Chats</p>
          {chats.length === 0 && (
            <p className="text-xs text-slate-500">No chats yet</p>
          )}
          {chats.map((chat) => {
            const other = chat.participants?.find((p) => p._id !== user?._id);
            const unread = unreadCounts[chat._id] || 0;
            return (
              <div
                key={chat._id}
                onClick={() => dispatch(setSelectedChat(chat))}
                className="p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all border border-white/10 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium text-sm">{other?.username || "Chat"}</p>
                  <p className="text-slate-500 text-xs">Click to message</p>
                </div>
                {unread > 0 && (
                  <span className="min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;