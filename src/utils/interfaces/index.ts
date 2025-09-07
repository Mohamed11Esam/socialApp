import {USER_AGENT,GENDER,ROLE} from "../enums/index"
export interface IUser{
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
    isVerified?: boolean;
    accessToken?: string;
    refreshToken?: string;
}