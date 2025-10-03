import { IComment } from "../../../utils/interfaces";
import { AbstractRepository } from "../../abstract.repository";
import { Comment } from "./comment.model";

export class CommentRepository extends AbstractRepository<IComment> {
    constructor() {
        super(Comment);
    }
}