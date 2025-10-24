import { ObjectId } from "mongoose";
import { CommentRepository, PostRepository, UserRepository } from "../../DB";
import { REACTIONS } from "../enums";
import { NotFoundException, ForbiddenException } from "../errors";

export const addReactionProvider = async (
  repo: PostRepository | CommentRepository,
  id: string,
  userId: ObjectId,
  reaction: string
) => {
  // Implementation for adding a reaction

  const postExists = await repo.getOne({ _id: id });
  if (!postExists) {
    throw new NotFoundException("Post not found");
  }
  // If the target (post/comment) is frozen, disallow reactions
  // Post schema has `isFrozen`; comments may not — guard defensively
  if ((postExists as any).isFrozen) {
    throw new ForbiddenException(
      "This post is frozen and cannot be reacted to"
    );
  }
  // If the post owner has blocked the acting user, disallow
  try {
    const userRepo = new UserRepository();
    const owner = await userRepo.getOne({ _id: (postExists as any).userId });
    if (
      owner &&
      Array.isArray((owner as any).blockedUsers) &&
      (owner as any).blockedUsers.find(
        (b: any) => b.toString() === userId.toString()
      )
    ) {
      throw new ForbiddenException(
        "You are blocked from interacting with this user's content"
      );
    }
  } catch (e) {
    // ignore user lookup errors and proceed (postExists existed), but let ForbiddenException bubble
    if (e instanceof ForbiddenException) throw e;
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
    await repo.update({ _id: id, "reactions.userId": userId }, {
      $set: { "reactions.$.reaction": reaction },
    } as any);
  }
  // User hasn't reacted yet -> push a new reaction
};
