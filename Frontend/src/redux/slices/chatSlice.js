import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to search for users in your MongoDB
export const searchUsers = createAsyncThunk("chat/searchUsers", async (query) => {
  const response = await axios.get(`http://localhost:5000/api/users?search=${query}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return response.data;
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [], 
    selectedChat: null,
    searchResults: [],
    onlineUsers: [],
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchUsers.fulfilled, (state, action) => {
      state.searchResults = action.payload;
    });
  },
});

export const { setSelectedChat, setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;