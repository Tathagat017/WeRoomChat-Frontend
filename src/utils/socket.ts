import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false, // control manually
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const createSocket = (baseUrl: string, token: string) => {
  return io(baseUrl, {
    auth: { token },
  });
};
