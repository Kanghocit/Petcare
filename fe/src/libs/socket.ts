import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const getSocketBaseUrl = () => {
  const explicit = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (explicit) return explicit;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  // If developer set API as http://host:port/api, strip the /api for Socket.IO
  try {
    const url = new URL(apiUrl);
    if (url.pathname.endsWith("/api")) {
      url.pathname = url.pathname.replace(/\/api\/?$/, "");
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    // Fallback: naive strip
    return apiUrl.replace(/\/api\/?$/, "");
  }
};

export const getSocket = () => {
  if (socket) return socket;
  const baseUrl = getSocketBaseUrl();
  socket = io(baseUrl, {
    withCredentials: true,
    transports: ["websocket"],
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
