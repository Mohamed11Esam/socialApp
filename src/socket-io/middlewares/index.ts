import { Socket } from "socket.io";
import { UserRepository } from "../../DB";
import { NotFoundException, verifyToken } from "../../utils";

export const socketAuthMiddleware = async (socket: Socket, next: Function) => {
  try {
    const { authorization, token } = socket.handshake.auth as any;
    // prefer explicit token field, fallback to authorization
    let raw = token || authorization;
    if (
      !raw &&
      socket.handshake.query &&
      (socket.handshake.query.authorization || socket.handshake.query.token)
    ) {
      // some transports send auth via query params during polling
      raw =
        (socket.handshake.query as any).token ||
        (socket.handshake.query as any).authorization;
    }
    // strip Bearer prefix if present
    if (typeof raw === "string" && raw.startsWith("Bearer ")) {
      raw = raw.split(" ")[1];
    }
    // debug: log when no token present
    if (!raw) {
      // pass a helpful error to the client
      return next(new Error("Authentication token missing"));
    }
    const payload = verifyToken(raw);
    const userRepository = new UserRepository();
    const user = await userRepository.getOne(
      { _id: payload._id || payload.sub || payload.id },
      {},
      {}
    );
    if (!user) {
      throw new NotFoundException("User not found");
    }
    socket.data.user = user;
    next();
  } catch (error) {
    // ensure socket.io gets an Error instance with message for the client
    next(error instanceof Error ? error : new Error("Authentication failed"));
  }
};
