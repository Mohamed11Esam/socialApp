import { Schema } from "mongoose";
import { IPost } from "../../../utils/interfaces";
import { reactionSchema } from "../common";



export const postSchema = new Schema<IPost>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: function () {
        if (!this.attachments || this.attachments.length === 0) {
            return true;
        }
        return false;
    },
    trim: true
},
    reactions: [reactionSchema],
    attachments: [{ type: Schema.Types.ObjectId, ref: "Attachment" }],
},{ timestamps: true  , toJSON: { virtuals: true }, toObject: { virtuals: true }});

postSchema.virtual('comments', {
    localField: '_id',
    foreignField: 'postId',
    ref: 'Comment'
});