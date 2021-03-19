import { EntityRepository, MongoRepository } from 'typeorm';
import { Log } from '../models/Log';

@EntityRepository(Log)
export class LogRepository extends MongoRepository<Log>  {

}