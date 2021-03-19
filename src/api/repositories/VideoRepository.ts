import { EntityRepository, MongoRepository } from 'typeorm';
import { Video } from '../models/Video';

@EntityRepository(Video)
export class VideoRepository extends MongoRepository<Video>  {

}