import { Request, Response } from "express";
import { CreatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { PostRepository } from "../../DB";
import { ForbiddenException, NotFoundException, REACTIONS } from "../../utils";
import { addReactionProvider } from "../../utils/providers/react.provider";

class PostService {
  private readonly postFactoryService = new PostFactoryService();
  private readonly postRepository = new PostRepository();
  create = async (req: Request, res: Response) => {
    const createPostDto: CreatePostDTO = req.body;
    const user = req.user;
    const newPost = this.postFactoryService.createPost(createPostDto, user);
    const createdPost = await this.postRepository.create(newPost);
    res.status(201).json({
      message: "Post created successfully",
      data: createdPost,
      success: true,
    });
  };

  addReaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reaction } = req.body;
    const userId = req.user._id;
    await addReactionProvider(this.postRepository, id, userId, reaction);

    return res.sendStatus(204);
  };

  updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;
    const updateDto = req.body as Partial<CreatePostDTO>;

    const post = await this.postRepository.getOne({ _id: id });
    if (!post) {
      throw new NotFoundException("Post not found");
    }
    if (post.userId.toString() !== userId.toString()) {
      throw new ForbiddenException("You are not allowed to update this post");
    }
    if ((post as any).isFrozen) {
      throw new ForbiddenException("This post is frozen and cannot be updated");
    }

    await this.postRepository.update({ _id: id }, updateDto as any);
    const updated = await this.postRepository.getOne({ _id: id });
    return res
      .status(200)
      .json({
        message: "Post updated successfully",
        data: updated,
        success: true,
      });
  };

  getSpecificPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const postExists = await this.postRepository.getOne(
      { _id: id },
      {},
      {
        populate: [
          { path: "userId", select: "fullName firstName lastName email" },
          {
            path: "reactions.userId",
            select: "fullName firstName lastName email",
          },
          { path: "comments", match: { parentIds: [] } },
        ],
      }
    );
    if (!postExists) {
      throw new NotFoundException("Post not found");
    }
    res.status(200).json({
      message: "Post retrieved successfully",
      data: postExists,
      success: true,
    });
  };
  deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const postExists = await this.postRepository.getOne({ _id: id });
    if (!postExists) {
      throw new NotFoundException("Post not found");
    }
    if (postExists.userId.toString() !== req.user._id.toString()) {
      throw new NotFoundException("You are not allowed to delete this post");
    }
    await this.postRepository.delete({ _id: id });
    res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  };
  freezePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const postExists = await this.postRepository.getOne({
      _id: id,
      isFrozen: false,
    });
    if (!postExists) {
      throw new NotFoundException("Post not found");
    }
    if (user?._id.toString() !== postExists.userId.toString()) {
      throw new ForbiddenException("You are not allowed to freeze this post");
    }
    postExists.isFrozen = true;
    await this.postRepository.update({ _id: id }, postExists);
    res.status(200).json({
      message: "Post frozen successfully",
      success: true,
    });
  };

  unFreezePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const postExists = await this.postRepository.getOne({
      _id: id,
      isFrozen: true,
    });
    if (!postExists) {
      throw new NotFoundException("Post not found");
    }
    if (user?._id.toString() !== postExists.userId.toString()) {
      throw new ForbiddenException("You are not allowed to unfreeze this post");
    }
    postExists.isFrozen = false;
    await this.postRepository.update({ _id: id }, postExists);
    res.status(200).json({
      message: "Post unfrozen successfully",
      success: true,
    });
  };
}

export default new PostService();
