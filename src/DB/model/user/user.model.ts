
import { model } from 'mongoose';
import { IUser } from './../../../utils/interfaces/index';
import { userSchema } from './user.schema';
export const User = model<IUser>("User", userSchema);