import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "../../../utils/interfaces";


export class Comment{

    userId: ObjectId;
        postId: ObjectId;
        parentIds : ObjectId[];
        content: string;
        attachments?: IAttachment[];
        mentions?: ObjectId[];
        reactions?: IReaction[];
}