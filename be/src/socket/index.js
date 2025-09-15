import { Server } from "socket.io";

let ioInstance = null;

const initSocket = (server) => {
  if (ioInstance) return ioInstance;

  ioInstance = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"],
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
