import { Schema } from "mongoose";

import { IComment } from "../../../utils/interfaces";
import { reactionSchema } from "../common";

export const CommentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    parentIds: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    content: { type: String, required: function() {
       if (!this.attachments || this.attachments.length === 0) {
         return true; // content is required if there are no attachments
       }
    }},
    attachments: [
        { url: { type: String, required: true }, id: { type: String, required: true } }
    ],
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reactions: [reactionSchema],
  },
  { timestamps: true }
);
