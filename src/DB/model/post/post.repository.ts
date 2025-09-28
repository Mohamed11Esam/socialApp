import { IPost } from "../../../utils/interfaces";
import { AbstractRepository } from "../../abstract.repository";
import { Post } from "./post.model";


export class PostRepository extends AbstractRepository<IPost> {
    constructor() {
        super(Post);
    }
}