import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import MessageContainer from "./MessageContainer";
import { connectSocket, disconnectSocket, socket } from "../../socket/socket";
import { fetchChats, fetchFriends, fetchRequests, incrementUnread } from "../../redux/slices/chatSlice";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { selectedChat } = useSelector((state) => state.chat);

  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchRequests());
    dispatch(fetchChats());
  }, [dispatch]);

  useEffect(() => {
    const handleMessage = (payload) => {
      const chatId = payload?.chatId;
      if (!chatId) return;
      if (selectedChat?._id === chatId) return;
      dispatch(incrementUnread(chatId));
    };

    socket.on("messageReceived", handleMessage);
    return () => socket.off("messageReceived", handleMessage);
  }, [dispatch, selectedChat]);

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