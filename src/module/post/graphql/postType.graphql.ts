import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";


export const postType =  new GraphQLObjectType({
            name: "Post",
            fields: {
                id: { type: GraphQLID },
                content: { type: GraphQLString },
                userId: { type: new GraphQLObjectType({
                    name: "UserSummary",
                    fields: {
                        id: { type: GraphQLID },
                        fullName: { type: GraphQLString },
                        email: { type: GraphQLString }
                    }
                }),
                },
                createdAt: { type: GraphQLString },
                updatedAt: { type: GraphQLString }
            }
        });