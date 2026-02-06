import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { app } from "./app.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    socket.on("joinChat", (chatId) => {
        if (chatId) socket.join(chatId);
    });

    socket.on("typing", (payload) => {
        if (!payload?.chatId) return;
        socket.to(payload.chatId).emit("typing", payload);
    });

    socket.on("stopTyping", (payload) => {
        if (!payload?.chatId) return;
        socket.to(payload.chatId).emit("stopTyping", payload);
    });

    socket.on("sendMessage", (payload) => {
        if (!payload?.chatId) return;
        socket.to(payload.chatId).emit("messageReceived", payload);
    });
});

server.listen(PORT, () => {
    console.log(`Server is listening on port :${PORT}`);
});