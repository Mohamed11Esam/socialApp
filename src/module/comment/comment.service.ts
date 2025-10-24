import { Request, Response } from "express";
import { NotFoundException, ForbiddenException } from "../../utils";
import { PostRepository, CommentRepository } from "../../DB";
import { IComment } from "../../utils/interfaces";
import { CommentFactoryService } from "./factory";
import { CreateCommentDto } from "./comment.dto";
import { addReactionProvider } from "../../utils/providers/react.provider";

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
    if ((postExist as any).isFrozen) {
      throw new ForbiddenException(
        "This post is frozen and cannot be commented on"
      );
    }
    // Prevent commenting if post owner has blocked this user
    try {
      const { UserRepository } = await import("../../DB");
      const userRepo = new UserRepository();
      const owner = await userRepo.getOne({ _id: (postExist as any).userId });
      if (
        owner &&
        Array.isArray((owner as any).blockedUsers) &&
        (owner as any).blockedUsers.find(
          (b: any) => b.toString() === req.user._id.toString()
        )
      ) {
        throw new ForbiddenException(
          "You are blocked from commenting on this user's content"
        );
      }
    } catch (e) {
      if (e instanceof ForbiddenException) throw e;
      // otherwise ignore and continue
    }
    let commentExist: IComment | any = undefined;
    if (id) {
      commentExist = await this.commentRepository.getOne({ _id: id });
      if (!commentExist) {
        throw new NotFoundException("Comment not found");
      }
      if ((commentExist as any).isFrozen) {
        throw new ForbiddenException(
          "This comment is frozen and cannot be replied to"
        );
      }
    }

    const createdComment = this.commentFactoryService.createComment(
      createCommentDto,
      req.user,
      postExist,
      commentExist
    );
    const savedComment = await this.commentRepository.create(createdComment);
    return res.status(201).json({
      message: "Comment created successfully",
      data: savedComment,
      success: true,
    });
  };
  getSpecific = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const comment = await this.commentRepository.getOne(
      { _id: id },
      {},
      {
        populate: [{ path: "replaies" }],
      }
    );
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }
    return res.status(200).json({
      message: "Comment retrieved successfully",
      data: comment,
      success: true,
    });
  };
  deleteComment = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const comment = await this.commentRepository.getOne({ _id: id });
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }
    await this.commentRepository.delete({ _id: id });
    return res.status(200).json({
      message: "Comment deleted successfully",
      success: true,
    });
  };
  updateComment = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const userId = req.user && req.user._id;
    const update = req.body as any;
    const comment = await this.commentRepository.getOne({ _id: id });
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }
    if (comment.userId.toString() !== userId.toString()) {
      throw new ForbiddenException(
        "You are not allowed to update this comment"
      );
    }
    if ((comment as any).isFrozen) {
      throw new ForbiddenException(
        "This comment is frozen and cannot be updated"
      );
    }
    await this.commentRepository.update({ _id: id }, update as any);
    const updated = await this.commentRepository.getOne({ _id: id });
    return res
      .status(200)
      .json({
        message: "Comment updated successfully",
        data: updated,
        success: true,
      });
  };
  addreaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reaction } = req.body;
    const userId = req.user._id;
    await addReactionProvider(this.commentRepository, id, userId, reaction);
  };

  freezeComment = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const user = req.user;
    const commentExists = await this.commentRepository.getOne({
      _id: id,
      isFrozen: false,
    });
    if (!commentExists) {
      throw new NotFoundException("Comment not found");
    }
    if (user?._id.toString() !== commentExists.userId.toString()) {
      throw new ForbiddenException(
        "You are not allowed to freeze this comment"
      );
    }
    commentExists.isFrozen = true;
    await this.commentRepository.update({ _id: id }, commentExists);
    return res
      .status(200)
      .json({ message: "Comment frozen successfully", success: true });
  };

  unFreezeComment = async (req: Request, res: Response) => {
    const { id } = req.params as any;
    const user = req.user;
    const commentExists = await this.commentRepository.getOne({
      _id: id,
      isFrozen: true,
    });
    if (!commentExists) {
      throw new NotFoundException("Comment not found");
    }
    if (user?._id.toString() !== commentExists.userId.toString()) {
      throw new ForbiddenException(
        "You are not allowed to unfreeze this comment"
      );
    }
    commentExists.isFrozen = false;
    await this.commentRepository.update({ _id: id }, commentExists);
    return res
      .status(200)
      .json({ message: "Comment unfrozen successfully", success: true });
  };
}

export default new CommentService();
