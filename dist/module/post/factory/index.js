"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostFactoryService = void 0;
const entity_1 = require("../entity");
class PostFactoryService {
    createPost(createPostDto, user) {
        const newPost = new entity_1.Post();
        newPost.content = createPostDto.content;
        newPost.attachments = [];
        newPost.reactions = [];
        newPost.userId = user._id;
        return newPost;
    }
}
exports.PostFactoryService = PostFactoryService;
