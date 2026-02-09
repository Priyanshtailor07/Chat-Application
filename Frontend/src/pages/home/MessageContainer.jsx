import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { SendHorizontal } from "lucide-react";
import axios from "axios";
import { socket } from "../../socket/socket";

const API = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true
});

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

const MessageContainer = () => {
  const { selectedChat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  const getUserId = () => user?._id || user?.id || user?.userId || "";

  const getSenderId = (msg) => {
    if (!msg) return "";
    const sender = msg.sender || {};
    return sender?._id || sender?.id || msg.senderId || msg.sender || "";
  };

  const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const roomId = useMemo(() => selectedChat?._id, [selectedChat]);
  const otherUser = useMemo(() => {
    if (!selectedChat?.participants || !user?._id) return null;
    return selectedChat.participants.find((p) => p._id !== user._id) || null;
  }, [selectedChat, user]);

  useEffect(() => {
    if (!roomId) return;
    socket.emit("joinChat", roomId);
    setMessages([]);

    const loadMessages = async () => {
      try {
        const response = await API.get(`/api/messages/${roomId}`, { headers: authHeader() });
        setMessages(response.data || []);
        await API.patch(`/api/messages/${roomId}/read`, {}, { headers: authHeader() });
      } catch (error) {
        console.error("Failed to load messages", error);
      }
    };

    loadMessages();
  }, [roomId]);

  useEffect(() => {
    const handleMessage = async (payload) => {
      if (payload?.chatId !== roomId) return;
      if (!payload?.message) return;
      setMessages((prev) => [...prev, payload.message]);
      try {
        await API.patch(`/api/messages/${roomId}/read`, {}, { headers: authHeader() });
      } catch (error) {
        console.error("Failed to mark read", error);
      }
    };

    const handleTyping = (payload) => {
      if (payload?.chatId !== roomId) return;
      setTypingUser(payload?.username || "Someone");
      setIsTyping(true);
    };

    const handleStopTyping = (payload) => {
      if (payload?.chatId !== roomId) return;
      setIsTyping(false);
      setTypingUser("");
    };

    socket.on("messageReceived", handleMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("messageReceived", handleMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [roomId]);

  const handleSend = async () => {
    const content = messageInput.trim();
    if (!content || !roomId) return;

    try {
      const response = await API.post(
        "/api/messages",
        { chatId: roomId, content },
        { headers: authHeader() }
      );

      const savedMessage = response.data;
      setMessages((prev) => [...prev, savedMessage]);
      socket.emit("sendMessage", { chatId: roomId, message: savedMessage });
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  useEffect(() => {
    if (!roomId) return;
    if (!messageInput.trim()) {
      socket.emit("stopTyping", { chatId: roomId, userId: getUserId(), username: user?.username });
      return;
    }

    socket.emit("typing", { chatId: roomId, userId: getUserId(), username: user?.username });
    const timeout = setTimeout(() => {
      socket.emit("stopTyping", { chatId: roomId, userId: getUserId(), username: user?.username });
    }, 900);

    return () => clearTimeout(timeout);
  }, [messageInput, roomId, user?.username]);

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
        <span className="text-white font-bold">{otherUser?.username || "Chat"}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const userId = getUserId();
          const otherId = otherUser?._id || otherUser?.id || otherUser?.userId || "";
          const senderId = getSenderId(msg);
          const isMine = senderId && userId
            ? String(senderId) === String(userId)
            : msg?.senderName
              ? msg.senderName === user?.username
              : false;
          const isOther = senderId && otherId ? String(senderId) === String(otherId) : false;
          const alignRight = isMine && !isOther;
          const timeValue = msg?.createdAt || msg?.updatedAt || msg?.timestamp;
          return (
            <div key={msg._id} className="flex w-full">
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                  alignRight ? "bg-blue-600 text-white ml-auto" : "bg-white/10 text-white mr-auto"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span>{msg.content}</span>
                  {timeValue && (
                    <span
                      className={`text-[10px] ${alignRight ? "text-blue-100/80 self-end" : "text-white/60 self-start"}`}
                    >
                      {formatTime(timeValue)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {isTyping && (
        <div className="px-4 pb-2 text-xs text-slate-400">
          {typingUser} is typing...
        </div>
      )}
      <div className="p-4 bg-slate-900/80 border-t border-white/10">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Type a message..."
            className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            aria-label="Send message"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;