import { IUser } from "../../../utils/interfaces";
import { Post } from "../entity";
import { CreatePostDTO } from "../post.dto";

export class PostFactoryService {
    createPost(createPostDto : CreatePostDTO,user:IUser){
        const newPost = new Post();
        newPost.content = createPostDto.content;
        newPost.attachments = [];
        newPost.reactions = [];
        newPost.userId  = user._id;
        return newPost;
    }
}