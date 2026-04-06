import { io } from "socket.io-client";
const base_url = import.meta.env.VITE_SOCKET_URL;

const socket = io(base_url, {
  auth: { token: localStorage.getItem("token") },
  transports: ["websocket"],
  reconnectionAttempts: 10,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
  socket.emit("userOnline");
});

export default socket;
