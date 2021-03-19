import { EntityRepository, MongoRepository } from 'typeorm';
import { Tag } from '../models/Tag';

@EntityRepository(Tag)
export class TagRepository extends MongoRepository<Tag>  {

}