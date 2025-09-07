import * as jwt from "jsonwebtoken";
import { model, Schema } from "mongoose";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || "change_this_secret";

export function generateToken(userId: any, expiresIn: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

// simple TokenBlacklist model to store refresh tokens (or revoked tokens)
const tokenSchema = new Schema(
  {
    token: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String },
  },
  { timestamps: true }
);

export const TokenBlacklist = model("TokenBlacklist", tokenSchema);
