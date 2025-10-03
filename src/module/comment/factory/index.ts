
import { IComment, IPost, IUser } from '../../../utils/interfaces';
import { Comment } from '../intity';
import { CreateCommentDto } from './../comment.dto';
export class CommentFactoryService {
    createComment(CreateCommentDto: CreateCommentDto,user:IUser,postId:IPost,comment?:IComment) {
        // Logic to create a comment entity
        const newComment = new Comment();
        newComment.content = CreateCommentDto.content;
        newComment.userId = user._id;
        newComment.postId = postId._id;
        newComment.parentIds = comment ? [...comment.parentIds, comment._id] : [];
        newComment.attachments = CreateCommentDto.attatchments;
        newComment.mentions = [];
        newComment.reactions = [];// Will be set by the database
        return newComment;

    }
}