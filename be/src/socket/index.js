import { Server } from "socket.io";

let ioInstance = null;

const initSocket = (server) => {
  if (ioInstance) return ioInstance;

  ioInstance = new Server(server, {
    cors: {
      // Allow both admin & FE (any origin in dev/prod)
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("a user disconnected");
    });
  });

  return ioInstance;
};

export const getIo = () => ioInstance;

export default initSocket;
