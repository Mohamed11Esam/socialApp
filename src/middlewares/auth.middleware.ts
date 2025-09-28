import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils";
import { UserRepository } from "../DB";
import { NotFoundException, UnauthorizedException } from "../utils/errors";

export const isAuthenticated = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || "";

  // Expect header format: "Bearer <token>"
  if (!authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedException(
      "Authorization header missing or malformed"
    );
  }

  const token = authHeader.split(" ")[1]?.trim();
  if (!token) {
    throw new UnauthorizedException("Token missing");
  }

  let payload: any;
  try {
    payload = verifyToken(token);
  } catch (_e) {
    throw new UnauthorizedException("Invalid token");
  }

  // verify() may return a string or object; also support various id keys
  if (!payload || typeof payload === "string") {
    throw new UnauthorizedException("Invalid token payload");
  }

  const userId = payload.sub || payload._id || payload.id;
  if (!userId) {
    throw new UnauthorizedException("Invalid token payload");
  }

  const userRepository = new UserRepository();
  const user = await userRepository.getOne({ _id: userId }, {}, {});
  if (!user) {
    throw new NotFoundException("User not found");
  }

  req.user = user;
  next();
};
