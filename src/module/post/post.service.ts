import { Request, Response } from "express";
import { CreatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { PostRepository } from "../../DB";
import { NotFoundException, REACTIONS } from "../../utils";
import { addReactionProvider } from "../../utils/providers/react.provider";

class PostService {
  private readonly postFactoryService = new PostFactoryService();
  private readonly postRepository = new PostRepository();
  create = async (req: Request, res: Response) => {
    const createPostDto: CreatePostDTO = req.body;
    const user = req.user;
    const newPost = this.postFactoryService.createPost(createPostDto, user);
    const createdPost = await this.postRepository.create(newPost);
    res
      .status(201)
      .json({
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
    res
      .status(200)
      .json({
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
    res
      .status(200)
      .json({
        message: "Post deleted successfully",
        success: true,
      });
  };

}

export default new PostService();
