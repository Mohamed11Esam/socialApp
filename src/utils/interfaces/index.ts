import { JwtPayload } from "jsonwebtoken";
import {USER_AGENT,GENDER,ROLE, REACTIONS} from "../enums/index"
import { Request } from "express";
import { ObjectId } from "mongoose";
export interface IUser{
    _id: ObjectId;
    firstName: string;
    lastName: string;
    fullName?: string;
    email: string;
    password: string;
    credentialUpdatedAt: Date;
    phone?: string;
    role : ROLE;
    gender: GENDER;
    userAgent: USER_AGENT;
    otp?: string;
    otpExpiresAt?: Date;
    twoFactorEnabled?: boolean;
    isVerified?: boolean;
    accessToken?: string;
    refreshToken?: string;
}
export interface Ipayload extends JwtPayload{
    _id:string;
    role: ROLE;
}

declare module "express"{
    interface Request{
        user: IUser;
    }
}

export interface IReaction{
    userId: ObjectId;
    reaction:REACTIONS; // e.g., 'like', 'love', etc.
}
export interface IPost{
    _id: ObjectId;
    userId: ObjectId;
    content: string;
    reactions: IReaction[];
    attachments?: IAttachment[];
    comments?: IComment[];
}
export interface IComment{
    _id:ObjectId;
    user: IUser;
    content: string;    
    author: IUser;
    post: IPost;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAttachment{
    url: string;
    id:string;
}

export interface IComment{
    userId: ObjectId;
    postId: ObjectId;
    parentId : ObjectId | null;
    content: string;
    attachments?: IAttachment[];
    mentions?: ObjectId[];
    reactions?: IReaction[];
}