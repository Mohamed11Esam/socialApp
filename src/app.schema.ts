import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { get } from "http";
import { postQuery } from "./module/post/graphql/query";

let query = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...postQuery
  },
});
export const appSchema = new GraphQLSchema({
  // Define your Query, Mutation, and Subscription types here
  query,
});