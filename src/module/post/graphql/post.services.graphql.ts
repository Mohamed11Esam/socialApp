import { PostRepository } from "../../../DB";
import { isAuthenticatedgraphql } from "../../../middlewares/auth.graphql.middleware";
import { isValidGraphQL } from "../../../middlewares/vaildation.middleware.graphql";
import { getPostParamsSchema } from "../post.validation";


export const getpost = async (parent: any, args: any, context: any) => {
            await isAuthenticatedgraphql(context);
            isValidGraphQL(getPostParamsSchema, args);
            const postRepository = new PostRepository();
            const post = await postRepository.getOne({_id: args.id},{},{populate:[{path:'userId', select:'fullName firstName lastName email'}]});
            if(!post) {
                throw new Error("Post not found");
            }
            return {message: "Post found", success: true, data: post};
        }