import { IMessage } from "../../../utils/interfaces";
import { AbstractRepository } from "../../abstract.repository";
import { Message } from "./messga.model";


export class MessageRepository extends AbstractRepository<IMessage> {
    constructor() {
        super(Message);
    }
}