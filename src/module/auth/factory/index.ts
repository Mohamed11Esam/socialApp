import { GENDER, ROLE, USER_AGENT } from "../../../utils/enums";
import { generateHash } from "../../../utils/hash";
import { generateOtp, generateOtpExpiry } from "../../../utils/otp";
import { RegisterDto } from "../auth.dto";
import { LoginDto } from "../auth.dto";
import { User } from "../entity";

export class AuthFactory {
    register(data: RegisterDto): User {
        const user = new User();
        user.email = data.email as string;
        user.password = generateHash(data.password as string);
        user.role = ROLE.USER;
        user.gender = data.gender as GENDER;
        user.userAgent = USER_AGENT.LOCAL;
        user.otp = generateOtp();
        user.otpExpiresAt = generateOtpExpiry(10);
        return user;

    }

    loginResponse(user: User, accessToken: string, refreshToken: string) {
        return {
            user,
            accessToken,
            refreshToken
        };
    }
}