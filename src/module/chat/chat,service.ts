import { Request, Response } from "express";
import { ChatRepository } from "../../DB";

class ChatService {
  private readonly chatRepository = new ChatRepository();
  getChat = async (req: Request, res: Response) => {
    try {
      const otherUserId = req.params.userId;
      const userLoginId = req.user && req.user._id;
      if (!otherUserId) {
        return res
          .status(400)
          .json({ message: "other user id is required", success: false });
      }

      const filter = { users: { $all: [otherUserId, userLoginId] } } as any;
      const chat = await this.chatRepository.getOne(
        filter,
        {},
        {
          populate: [
            { path: "messages" },
            {
              path: "users",
              select: "fullName firstName lastName email isOnline lastSeen",
            },
          ],
        }
      );

      if (!chat) {
        return res
          .status(404)
          .json({ message: "chat not found", success: false });
      }

      return res
        .status(200)
        .json({ message: "chat found", success: true, data: chat });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "internal server error", success: false, error });
    }
  };
}

export const chatService = new ChatService();
