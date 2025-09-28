"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const factory_1 = require("./factory");
const post_repository_1 = require("../../DB/model/post/post.repository");
const utils_1 = require("../../utils");
class PostService {
    constructor() {
        this.postFactoryService = new factory_1.PostFactoryService();
        this.postRepository = new post_repository_1.PostRepository();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const createPostDto = req.body;
            const user = req.user;
            const newPost = this.postFactoryService.createPost(createPostDto, user);
            const createdPost = yield this.postRepository.create(newPost);
            res.status(201).json({ message: "Post created successfully", data: createdPost, success: true });
        });
        this.addReaction = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { reaction } = req.body;
            const userId = req.user._id;
            const postExists = yield this.postRepository.getOne({ _id: id });
            if (!postExists) {
                throw new utils_1.NotFoundException("Post not found");
            }
            let userReactedIndex = postExists.reactions.findIndex((reaction) => {
                return reaction.userId.toString() === userId.toString();
            });
            // If user already reacted -> update the existing reaction entry
            if (userReactedIndex !== -1) {
                yield this.postRepository.update({ _id: id, "reactions.userId": userId }, { $set: { "reactions.$.reaction": reaction } });
                return res.sendStatus(204);
            }
            // User hasn't reacted yet -> push a new reaction
            yield this.postRepository.update({ _id: id }, { $push: { reactions: { reaction, userId } } });
            return res.sendStatus(204);
        });
    }
}
exports.default = new PostService();
