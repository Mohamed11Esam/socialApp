"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repository_1 = require("../../DB/model/user/user.repository");
const errors_1 = require("../../utils/errors");
class UserService {
    constructor() {
        // User service methods would go here
        this.userRepository = new user_repository_1.UserRepository();
        this.getUserProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // Logic to retrieve user profile by userId
            let user = yield this.userRepository.getOne({ _id: req.params.userId }, {}, {});
            if (!user) {
                throw new errors_1.NotFoundException("User not found");
            }
            return res.status(200).json({ user, success: true });
        });
        // Initialize any required dependencies here
    }
}
exports.default = new UserService();
