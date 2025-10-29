import { Server as httpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { socketAuthMiddleware } from "./middlewares";
import { sendMessage } from "./chat";
import { handleUserStatus } from "./status";

const connectedClients: Map<string, string> = new Map();

export const initSocket = (server: httpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.use(socketAuthMiddleware);
  io.on("connection", (socket: Socket) => {
    connectedClients.set(socket.data.user.id, socket.id);
    console.log(connectedClients);

    // Initialize user status handlers
    handleUserStatus(socket, io, connectedClients);

    socket.on("sendMessage", sendMessage(socket, io, connectedClients));
  });
};
