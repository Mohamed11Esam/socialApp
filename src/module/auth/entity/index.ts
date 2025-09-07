import { GENDER, ROLE, USER_AGENT } from "../../../utils/enums";

export class User {
  public firstName !: string;
  public lastName !: string;
  public fullName ?: string;
  public email !: string;
  public password !: string;
  public credentialUpdatedAt !: Date;
  public phone ?: string;
  public role !: ROLE;
  public gender !: GENDER;
  public userAgent !: USER_AGENT;
  public otp ?: string;
  public otpExpiresAt ?: Date;
}
