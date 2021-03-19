import { EntityRepository, MongoRepository } from 'typeorm';
import { Category } from '../models/Category';

@EntityRepository(Category)
export class CategoryRepository extends MongoRepository<Category>  {

} 