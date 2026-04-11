import { io } from "socket.io-client";
const base_url = import.meta.env.VITE_SOCKET_URL;

const socket = io(base_url, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem("token"),
  },
  transports: ["websocket"],
  reconnectionAttempts: 10,
});

socket.on("reconnect_attempt", () => {
  socket.auth = { token: localStorage.getItem("token") };
});

socket.on("connect", () => {
  socket.emit("userOnline");
});

export default socket;
