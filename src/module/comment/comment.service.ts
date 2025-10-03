import { Request, Response } from "express";
import { NotFoundException } from "../../utils";
import { PostRepository, CommentRepository } from "../../DB";
import { IComment } from "../../utils/interfaces";
import { CommentFactoryService } from "./factory";
import { CreateCommentDto } from "./comment.dto";

class CommentService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();
  private readonly commentFactoryService = new CommentFactoryService();
  createComment = async (req: Request, res: Response) => {
    const { postId, id } = req.params as any;
    const postExist = await this.postRepository.getOne({ _id: postId });
    const createCommentDto: CreateCommentDto = req.body;
    if (!postExist) {
      throw new NotFoundException("Post not found");
    }
    let commentExist: IComment | any = undefined;
    if (id) {
      commentExist = await this.commentRepository.getOne({ _id: id });
      if (!commentExist) {
        throw new NotFoundException("Comment not found");
      }
    }

    const createdComment = this.commentFactoryService.createComment(
      createCommentDto,
      req.user,
      postExist,
      commentExist
    );
    const savedComment = await this.commentRepository.create(createdComment);
    return res
      .status(201)
      .json({
        message: "Comment created successfully",
        data: savedComment,
        success: true,
      });
  };
}

export default new CommentService();
