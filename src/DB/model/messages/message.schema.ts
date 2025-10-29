import { Schema } from "mongoose";
import { IMessage } from "../../../utils/interfaces";

export const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [1, "Message content cannot be empty"],
    },
  },
  {
    timestamps: true,
  }
);
