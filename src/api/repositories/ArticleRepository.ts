import { EntityRepository, MongoRepository } from 'typeorm';
import { Article } from '../models/Article';

@EntityRepository(Article)
export class ArticleRepository extends MongoRepository<Article>  {

}