import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true
});

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("accessToken")}` });

// Thunk to search for users
export const searchUsers = createAsyncThunk("chat/searchUsers", async (query) => {
  const response = await API.get(`/api/users/search?search=${query}`, {
    headers: authHeader()
  });
  return response.data;
});

export const fetchFriends = createAsyncThunk("chat/fetchFriends", async () => {
  const response = await API.get("/api/users/friends", { headers: authHeader() });
  return response.data;
});

export const fetchRequests = createAsyncThunk("chat/fetchRequests", async () => {
  const response = await API.get("/api/users/requests", { headers: authHeader() });
  return response.data;
});

export const sendFriendRequest = createAsyncThunk("chat/sendFriendRequest", async (userId, { rejectWithValue }) => {
  try {
    const response = await API.post("/api/users/requests/send", { userId }, { headers: authHeader() });
    return { userId, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to send request");
  }
});

export const acceptFriendRequest = createAsyncThunk("chat/acceptFriendRequest", async (userId, { rejectWithValue }) => {
  try {
    const response = await API.post("/api/users/requests/accept", { userId }, { headers: authHeader() });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to accept request");
  }
});

export const rejectFriendRequest = createAsyncThunk("chat/rejectFriendRequest", async (userId, { rejectWithValue }) => {
  try {
    const response = await API.post("/api/users/requests/reject", { userId }, { headers: authHeader() });
    return { userId, ...response.data };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to reject request");
  }
});

export const createChat = createAsyncThunk("chat/createChat", async (email, { rejectWithValue }) => {
  try {
    const response = await API.post("/api/chats/create-new-chat", { email }, { headers: authHeader() });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to create chat");
  }
});

export const fetchChats = createAsyncThunk("chat/fetchChats", async () => {
  const response = await API.get("/api/chats/get-all-chats", { headers: authHeader() });
  return response.data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    selectedChat: null,
    searchResults: [],
    onlineUsers: [],
    friends: [],
    requests: {
      received: [],
      sent: []
    },
    unreadCounts: {}
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
      if (action.payload?._id) {
        state.unreadCounts[action.payload._id] = 0;
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    incrementUnread: (state, action) => {
      const chatId = action.payload;
      state.unreadCounts[chatId] = (state.unreadCounts[chatId] || 0) + 1;
    },
    clearUnread: (state, action) => {
      const chatId = action.payload;
      state.unreadCounts[chatId] = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends = action.payload;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.requests = action.payload;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        const userId = action.payload.userId;
        state.searchResults = state.searchResults.map((u) =>
          u._id === userId ? { ...u, requestSent: true } : u
        );
        const user = state.searchResults.find((u) => u._id === userId);
        if (user) state.requests.sent = [user, ...state.requests.sent];
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        const friend = action.payload.friend;
        state.requests.received = state.requests.received.filter((u) => u._id !== friend._id);
        state.friends = [friend, ...state.friends];
        state.searchResults = state.searchResults.map((u) =>
          u._id === friend._id ? { ...u, isFriend: true, requestReceived: false } : u
        );
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        const userId = action.payload.userId;
        state.requests.received = state.requests.received.filter((u) => u._id !== userId);
        state.searchResults = state.searchResults.map((u) =>
          u._id === userId ? { ...u, requestReceived: false } : u
        );
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        const exists = state.chats.find((c) => c._id === action.payload._id);
        if (!exists) state.chats = [action.payload, ...state.chats];
        state.selectedChat = action.payload;
        state.unreadCounts[action.payload._id] = 0;
      });
  },
});

export const { setSelectedChat, setOnlineUsers, incrementUnread, clearUnread } = chatSlice.actions;
export default chatSlice.reducer;