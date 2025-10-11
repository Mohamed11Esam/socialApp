import { NextFunction, Request, Response } from "express";
import { RegisterDto, VerifyOtpDto, LoginDto } from "./auth.dto";
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "../../utils/errors";
import { UserRepository } from "../../DB";
import { AuthFactory } from "./factory/index";
import { sendMail } from "../../utils";
import { generateOtp, generateOtpExpiry } from "../../utils";
import { compareHash } from "../../utils";
import { generateToken } from "../../utils";
import { generateHash } from "../../utils";
class AuthService {
  // Define your authentication-related methods here
  private userRepository = new UserRepository();
  private authFactory = new AuthFactory();
  constructor() {
    // Initialize any required dependencies here
  }

  async register(req: Request, res: Response, next: NextFunction) {
    const registerDto: RegisterDto = req.body;

    const userExist = await this.userRepository.getOne(
      { email: registerDto.email },
      {},
      {}
    ); // Check if user already exists
    if (userExist) {
      throw new ConflictException("User already exists");
    }
    const user = await this.authFactory.register(registerDto);

    const savedUser = await this.userRepository.create(user);
    return res.status(201).json({
      message: "User registered successfully",
      user: savedUser,
      success: true,
    });
  }
  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    const verifyOtpDto: VerifyOtpDto = req.body;

    const user = await this.userRepository.getOne(
      { email: verifyOtpDto.email },
      {},
      {}
    );

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isVerified) {
      return res
        .status(200)
        .json({ message: "User already verified", success: true });
    }

    // validate OTP
    if (!user.otp || user.otp !== verifyOtpDto.otp) {
      throw new UnauthorizedException("Invalid OTP");
    }

    // check expiry
    if (!user.otpExpiresAt || new Date(user.otpExpiresAt) < new Date()) {
      throw new UnauthorizedException("OTP expired");
    }

    // mark user as verified and clear otp fields
    await this.userRepository.update(
      { email: verifyOtpDto.email },
      { isVerified: true, otp: null as any, otpExpiresAt: null as any }
    );

    return res
      .status(200)
      .json({ message: "OTP verified successfully", success: true });
  }

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body as { email?: string };

    if (!email) {
      throw new NotFoundException("Email is required");
    }

    const user = await this.userRepository.getOne({ email }, {}, {});
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isVerified) {
      return res
        .status(200)
        .json({ message: "User already verified", success: true });
    }

    const otp = generateOtp();
    const otpExpiresAt = generateOtpExpiry(10); // 10 minutes

    await this.userRepository.update({ email }, { otp, otpExpiresAt });

    if (email) {
      await sendMail({
        to: email,
        subject: "Your OTP code",
        html: `<p>Your new verification code is: <strong>${otp}</strong></p>`,
      });
    }

    return res.status(200).json({ message: "OTP resent", success: true });
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const loginDto: LoginDto = req.body;

    const userExists = await this.userRepository.getOne(
      {
        $or: [
          {
            $and: [
              { email: { $ne: null } },
              { email: { $exists: true } },
              { email: loginDto.email },
            ],
          },
          {
            $and: [
              { phone: { $ne: null } },
              { phone: { $exists: true } },
              { phone: loginDto.phone },
            ],
          },
        ],
      } as any,
      {},
      {}
    );

    if (!userExists) {
      throw new ForbiddenException("invalid credentials");
    }

    const isMatch = compareHash(
      loginDto.password,
      userExists.password as string
    );
    if (!isMatch) {
      throw new ForbiddenException("invalid credentials");
    }

    // if user has 2FA enabled, send OTP and ask client to verify
    if (userExists.twoFactorEnabled) {
      const otp = generateOtp();
      const otpExpiresAt = generateOtpExpiry(10);
      await this.userRepository.update(
        { _id: userExists._id },
        { otp, otpExpiresAt }
      );
      // send mail
      if (userExists.email) {
        await sendMail({
          to: userExists.email,
          subject: "Your login OTP",
          html: `<p>Your login code is: <strong>${otp}</strong></p>`,
        });
      }
      return res.status(200).json({ message: "2FA code sent", success: true });
    }

    const accessToken = generateToken(userExists._id, "1h");
    const refreshToken = generateToken(userExists._id, "7d");

    const payload = this.authFactory.loginResponse(accessToken, refreshToken);

    return res.status(200).json({
      message: "Login successful",
      success: true,
      data: payload,
    });
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };
    const userId = req.user && req.user._id;
    if (!userId) {
      throw new UnauthorizedException("User not authenticated");
    }

    const user = await this.userRepository.getOne({ _id: userId });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const isMatch = await compareHash(currentPassword, user.password as string);
    if (!isMatch) {
      throw new ForbiddenException("Current password is incorrect");
    }

    const hashed = await generateHash(newPassword);
    await this.userRepository.update({ _id: userId }, { password: hashed });

    return res
      .status(200)
      .json({ message: "Password changed successfully", success: true });
  }

  async verifyLoginOtp(req: Request, res: Response, next: NextFunction) {
    const { email, otp } = req.body as { email: string; otp: string };
    const user = await this.userRepository.getOne({ email });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.otp || user.otp !== otp) {
      throw new UnauthorizedException("Invalid OTP");
    }
    if (!user.otpExpiresAt || new Date(user.otpExpiresAt) < new Date()) {
      throw new UnauthorizedException("OTP expired");
    }

    // clear otp and issue tokens
    await this.userRepository.update(
      { _id: user._id },
      { otp: null as any, otpExpiresAt: null as any }
    );
    const accessToken = generateToken(user._id, "1h");
    const refreshToken = generateToken(user._id, "7d");
    const payload = this.authFactory.loginResponse(accessToken, refreshToken);
    return res
      .status(200)
      .json({ message: "Login successful", success: true, data: payload });
  }
}

export default new AuthService();
