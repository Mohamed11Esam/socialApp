import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB/model/user/user.repository";
import { NotFoundException } from "../../utils/errors";

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

}

export default new UserService();