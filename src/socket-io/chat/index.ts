import { Server, Socket } from "socket.io";
import { Message } from "../../DB/model/messages/messga.model";
import { ChatRepository, MessageRepository } from "../../DB";
import { Chat } from "../../DB/model/chat/chat.model";
import {
  sendMessageSchema,
  SendMessageInput,
} from "../validation/message.validation";

export const sendMessage = (
  socket: Socket,
  io: Server,
  connectedClients: Map<string, string>
) => {
  return async (data: any) => {
    try {
      // Validate message data with Zod
      const validatedData = sendMessageSchema.parse(data);

      // Type-safe access to validated data
      const { message, destId } = validatedData;

      const destSocketId = connectedClients.get(destId);
      const messageData = { message, destId };
      socket.emit("successMessage", messageData);
      socket.to(destSocketId as string).emit("receiveMessage", messageData);

      const sender = socket.data.user._id || socket.data.user.id;
      const messageRepo = new MessageRepository();

      const createdMessage = await messageRepo.create({
        sender,
        content: message.trim(),
      });

      const chatRepo = new ChatRepository();
      const chat = await chatRepo.getOne({
        users: { $all: [destId, sender] },
      });

      if (!chat) {
        const newChat = await chatRepo.create({
          users: [destId, sender],
          messages: [createdMessage._id],
        });
      } else {
        await chatRepo.update(
          { _id: chat._id },
          {
            messages: [...chat.messages, createdMessage._id],
          }
        );
      }
    } catch (error) {
      // Handle validation errors
      if (error instanceof Error) {
        socket.emit("error", {
          message: "Message validation failed",
          details: error.message,
        });
      } else {
        socket.emit("error", {
          message: "Failed to send message",
          details: "Unknown error occurred",
        });
      }
      console.error("Message sending error:", error);
    }
  };
};
