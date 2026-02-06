import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
	withCredentials: true,
	autoConnect: false
});

const connectSocket = () => {
	if (!socket.connected) socket.connect();
};

const disconnectSocket = () => {
	if (socket.connected) socket.disconnect();
};

export { socket, connectSocket, disconnectSocket };