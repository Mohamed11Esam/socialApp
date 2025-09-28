import { sign, verify, SignOptions } from "jsonwebtoken";
import { devConfig } from "../../config/env/dev.config";
import { Ipayload } from "../interfaces";

const JWT_SECRET = (devConfig.JWT_SECRET as string) || "change_this_secret";

export function generateToken(userId: any, expiresIn: string): string {
  return sign({ sub: userId }, JWT_SECRET, { expiresIn } as SignOptions);
}

export function verifyToken(token: string) {
  return verify(token, JWT_SECRET) as Ipayload;
}

// simple TokenBlacklist model to store refresh tokens (or revoked tokens)
