import { ObjectId } from "mongoose";
import { CommentRepository, PostRepository } from "../../DB";
import { REACTIONS } from "../enums";
import { NotFoundException } from "../errors";

export const addReactionProvider = async (repo: PostRepository|CommentRepository , id:string , userId:ObjectId , reaction:string) => {
    // Implementation for adding a reaction

    const postExists = await repo.getOne({ _id: id });
    if (!postExists) {
      throw new NotFoundException("Post not found");
    }
    let userReactedIndex = postExists.reactions.findIndex((reaction) => {
      return reaction.userId.toString() === userId.toString();
    });
    // If user already reacted -> update the existing reaction entry
    if (userReactedIndex == -1) {
      await repo.update({ _id: id }, {
        $push: {
          reactions: {
            reaction: [null, undefined, ""].includes(reaction)
              ? REACTIONS.LIKE
              : reaction,
            userId,
          },
        },
      } as any);
      
    } else if ([undefined, null, ""].includes(reaction)) {
      {
        await repo.update({ _id: id }, {
          $pull: { reactions: postExists.reactions[userReactedIndex] },
        } as any);
        
      }
    } else {
      await repo.update(
        { _id: id, "reactions.userId": userId },
        { $set: { "reactions.$.reaction": reaction } } as any
      );
    }
    // User hasn't reacted yet -> push a new reaction

    
}