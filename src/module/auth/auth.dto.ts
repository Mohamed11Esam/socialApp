import { GENDER } from "../../utils";

export interface RegisterDto {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    gender?: GENDER;
}

export interface VerifyOtpDto{
    email:string;
    otp:string;
}

export interface LoginDto {
    email?: string;
    phone?: string;
    password: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}