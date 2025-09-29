import { Schema } from "mongoose";
import { REACTIONS } from "../../../utils";
import { IReaction } from "../../../utils/interfaces";

export const reactionSchema = new Schema<IReaction>({
    reaction :{type: String, enum: Object.values(REACTIONS), default: REACTIONS.LIKE},
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
   
},{timestamps: true});