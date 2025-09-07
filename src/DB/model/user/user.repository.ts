
import { AbstractRepository } from '../../abstract.repository';
import { IUser } from './../../../utils/interfaces/index';
import { User } from './user.model';
export class UserRepository extends AbstractRepository<IUser> {
  constructor() {
    super(User);
  }

  getAllUsers(){
    return this.model.find();
  }

}
