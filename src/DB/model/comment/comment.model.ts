import {model} from "mongoose";
import { CommentSchema } from "./comment.schema";

export const Comment = model("Comment", CommentSchema);