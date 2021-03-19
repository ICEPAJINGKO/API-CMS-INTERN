import { EntityRepository, MongoRepository } from 'typeorm';
import { User } from '../models/User';

@EntityRepository(User)
export class UserRepository extends MongoRepository<User>  {

}
