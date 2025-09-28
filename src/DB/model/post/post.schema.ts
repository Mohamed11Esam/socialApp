import { Schema } from "mongoose";
import { IPost, IReaction } from "../../../utils/interfaces";
import { REACTIONS } from "../../../utils";


export const reactionSchema = new Schema<IReaction>({
    reaction :{type: String, enum: Object.values(REACTIONS), default: REACTIONS.LIKE},
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
   
},{timestamps: true});

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
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
},{ timestamps: true });