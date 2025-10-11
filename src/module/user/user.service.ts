import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB/model/user/user.repository";
import { NotFoundException } from "../../utils/errors";
import { compareHash, generateOtp, generateOtpExpiry, sendMail } from "../../utils";

class UserService {
  // User service methods would go here
  private readonly userRepository = new UserRepository();   
  constructor() {
    // Initialize any required dependencies here
  }

  getUserProfile = async(req: Request, res: Response, next: NextFunction) =>{
    // Logic to retrieve user profile by userId
    let user = await this.userRepository.getOne({ _id: req.params.userId }, {}, {});
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return res.status(200).json({ user, success: true });
  } 

  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user && req.user._id;
    if (!userId) {
      throw new NotFoundException("User not authenticated");
    }
    const update = req.body as any;
    const updated = await this.userRepository.update({ _id: userId }, update);
    return res.status(200).json({ message: "Profile updated", data: updated, success: true });
  };

  toggleTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user && req.user._id;
    if (!userId) {
      throw new NotFoundException("User not authenticated");
    }
    const { enable, password } = req.body as any;
    const user = await this.userRepository.getOne({ _id: userId });
    if (!user) throw new NotFoundException("User not found");
    if (enable) {
      // require password to enable
      if (!password) throw new NotFoundException("Password is required to enable 2FA");
      const match = await compareHash(password, user.password as string);
      if (!match) throw new NotFoundException("Password does not match");
    }
    await this.userRepository.update({ _id: userId }, { twoFactorEnabled: enable });
    return res.status(200).json({ message: `Two-factor authentication ${enable ? 'enabled' : 'disabled'}`, success: true });
  };

  changeEmail = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user && req.user._id;
    if (!userId) {
      throw new NotFoundException("User not authenticated");
    }
    const { newEmail, currentPassword } = req.body as any;
    // verify current password
    const user = await this.userRepository.getOne({ _id: userId });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const isMatch = await compareHash(currentPassword, user.password as string);
    if (!isMatch) {
      throw new NotFoundException("Current password is incorrect");
    }
    // ensure email uniqueness
    const existing = await this.userRepository.getOne({ email: newEmail });
    if (existing) {
      throw new NotFoundException("Email already in use");
    }
    // generate otp and expiry
    const otp = generateOtp();
    const otpExpiresAt = generateOtpExpiry(10);
    await this.userRepository.update({ _id: userId }, { email: newEmail, isVerified: false, otp, otpExpiresAt });
    // send OTP to new email
    await sendMail({ to: newEmail, subject: "Confirm your new email", html: `<p>Your OTP is <strong>${otp}</strong></p>` });
    return res.status(200).json({ message: "Email changed — please verify the new email with the sent OTP", success: true });
  };

}

export default new UserService();