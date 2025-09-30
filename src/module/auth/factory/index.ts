import { GENDER, ROLE, USER_AGENT } from "../../../utils/enums";
import { generateHash } from "../../../utils/hash";
import { generateOtp, generateOtpExpiry } from "../../../utils/otp";
import { RegisterDto } from "../auth.dto";
import { User } from "../entity";

export class AuthFactory {
  async register(data: RegisterDto) {
    const user = new User();

    // Split fullName into firstName and lastName
    const nameParts = data.fullName.trim().split(" ");
    user.firstName = nameParts[0];
    user.lastName = nameParts.slice(1).join(" ") || nameParts[0]; // If no last name, use first name

    user.email = data.email as string;
    user.password = await generateHash(data.password as string);
    user.role = ROLE.USER;
    user.gender = data.gender as GENDER;
    user.userAgent = USER_AGENT.LOCAL;
    user.otp = generateOtp();
    user.otpExpiresAt = generateOtpExpiry(10);
    return user;
  }

  loginResponse(accessToken: string, refreshToken: string) {
    return {
      accessToken,
      refreshToken,
    };
  }
}
