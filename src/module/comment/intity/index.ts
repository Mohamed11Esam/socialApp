import { ObjectId } from "mongoose";
import { IAttachment, IReaction } from "../../../utils/interfaces";


export class Comment{

    userId: ObjectId;
        postId: ObjectId;
        parentId : ObjectId | null;
        content: string;
        attachments?: IAttachment[];
        mentions?: ObjectId[];
        reactions?: IReaction[];
}