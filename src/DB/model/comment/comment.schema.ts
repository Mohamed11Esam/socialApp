import { Schema } from "mongoose";

import { IComment } from "../../../utils/interfaces";
import { reactionSchema } from "../common";

export const CommentSchema = new Schema<IComment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    content: {
      type: String,
      required: function () {
        if (!this.attachments || this.attachments.length === 0) {
          return true; // content is required if there are no attachments
        }
      },
    },
    attachments: [
      {
        url: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    mentions: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reactions: [reactionSchema],
    isFrozen: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CommentSchema.virtual("replaies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentId",
});

CommentSchema.pre("deleteOne", async function (next) {
  const ctx: any = this;
  const filter = typeof ctx.getFilter === "function" ? ctx.getFilter() : {};
  const replies = await ctx.model.find({ parentId: filter._id });
  if (replies.length) {
    for (const reply of replies) {
      await ctx.model.deleteOne({ _id: reply._id });
    }
  }
  next();
});
