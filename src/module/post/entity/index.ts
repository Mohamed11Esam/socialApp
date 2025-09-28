import { ObjectId } from "mongoose";
import { IReaction } from "../../../utils/interfaces";

 export class Post{
    userId:ObjectId;
    content:string;
    attachments?:any[];
    reactions?:IReaction[];
 }