import { Server, Socket } from "socket.io";
import { UserRepository } from "../../DB";
import { typingSchema, TypingInput } from "../validation/message.validation";

// Track typing users: Map<chatId, Set<userId>>
const typingUsers = new Map<string, Set<string>>();

export const handleUserStatus = (
  socket: Socket,
  io: Server,
  connectedClients: Map<string, string>
) => {
  const userRepository = new UserRepository();

  // User goes online when connecting
  const goOnline = async () => {
    const userId = socket.data.user._id;
    if (userId) {
      await userRepository.update(
        { _id: userId },
        {
          isOnline: true,
          lastSeen: new Date(),
        }
      );

      // Notify friends about online status
      socket.broadcast.emit("userOnline", { userId, isOnline: true });
    }
  };

  // User goes offline when disconnecting
  const goOffline = async () => {
    const userId = socket.data.user._id;
    if (userId) {
      await userRepository.update(
        { _id: userId },
        {
          isOnline: false,
          lastSeen: new Date(),
        }
      );

      // Remove from all typing indicators
      typingUsers.forEach((typingSet, chatId) => {
        if (typingSet.has(userId.toString())) {
          typingSet.delete(userId.toString());
          socket.broadcast.emit("userStoppedTyping", { chatId, userId });
        }
      });

      // Notify friends about offline status
      socket.broadcast.emit("userOffline", {
        userId,
        isOnline: false,
        lastSeen: new Date(),
      });
    }
  };

  // Handle typing indicators with validation
  const handleTyping = (data: any) => {
    try {
      // Validate typing data with Zod
      const validatedData = typingSchema.parse(data);
      const { chatId, isTyping } = validatedData;

      const userId = socket.data.user._id.toString();

      if (!typingUsers.has(chatId)) {
        typingUsers.set(chatId, new Set());
      }

      const chatTypingUsers = typingUsers.get(chatId)!;

      if (isTyping) {
        chatTypingUsers.add(userId);
        socket.broadcast.emit("userTyping", { chatId, userId });
      } else {
        chatTypingUsers.delete(userId);
        socket.broadcast.emit("userStoppedTyping", { chatId, userId });
      }
    } catch (error) {
      // Handle validation errors
      if (error instanceof Error) {
        socket.emit("error", {
          message: "Typing indicator validation failed",
          details: error.message,
        });
      } else {
        socket.emit("error", {
          message: "Failed to process typing indicator",
        });
      }
      console.error("Typing validation error:", error);
    }
  };

  // Get online status of friends
  const getFriendsStatus = async () => {
    const userId = socket.data.user._id;
    const user = await userRepository.getOne(
      { _id: userId },
      {},
      {
        populate: [
          {
            path: "friends",
            select: "fullName firstName lastName isOnline lastSeen",
          },
        ],
      }
    );

    socket.emit("friendsStatus", { friends: (user as any)?.friends || [] });
  };

  // Set up event listeners
  socket.on("goOnline", goOnline);
  socket.on("disconnect", goOffline);
  socket.on("typing", handleTyping);
  socket.on("getFriendsStatus", getFriendsStatus);

  // Automatically go online when socket connects
  goOnline();
};
