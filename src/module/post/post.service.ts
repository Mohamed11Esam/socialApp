import { Request, Response } from "express";
import { CreatePostDTO } from "./post.dto";
import { PostFactoryService } from "./factory";
import { PostRepository } from "../../DB/model/post/post.repository";
import { NotFoundException } from "../../utils";

class PostService {
    private readonly postFactoryService = new PostFactoryService();
    private readonly postRepository = new PostRepository();
    create = async (req:Request,res:Response) => {
        const createPostDto: CreatePostDTO = req.body;
        const user = req.user;
        const newPost = this.postFactoryService.createPost(createPostDto, user);
        const createdPost = await this.postRepository.create(newPost);
        res.status(201).json({message:"Post created successfully",data:createdPost,success:true});
    }

    addReaction = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { reaction } = req.body;
        const userId = req.user._id;
        const postExists = await this.postRepository.getOne({ _id: id });
        if (!postExists) {
            throw new NotFoundException("Post not found");
        }
       let userReactedIndex = postExists.reactions.findIndex((reaction) => {
            return reaction.userId.toString() === userId.toString();
        });
        // If user already reacted -> update the existing reaction entry
        if (userReactedIndex !== -1) {
            await this.postRepository.update(
                { _id: id, "reactions.userId": userId },
                { $set: { "reactions.$.reaction": reaction } } as any
            );
            return res.sendStatus(204);
        }
        // User hasn't reacted yet -> push a new reaction
        await this.postRepository.update(
            { _id: id },
            { $push: { reactions: { reaction, userId } } } as any
        );
        return res.sendStatus(204);
        
    }
}


export default new PostService();