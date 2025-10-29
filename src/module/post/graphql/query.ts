
import { PostRepository } from './../../../DB/model/post/post.repository';
import { GraphQLBoolean, GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { postType } from './postType.graphql';
import { getpost } from './post.services.graphql';


export const postQuery = {
    getPost: {
        args: {
            id: { type: GraphQLID}
        },
        type: new GraphQLObjectType({
            name: "GetPostResponse",
            fields: {
                message: { type: GraphQLString },
                success: { type: GraphQLBoolean },
                data: { type: postType }
            }
        }),
        resolve: getpost,
    },

}