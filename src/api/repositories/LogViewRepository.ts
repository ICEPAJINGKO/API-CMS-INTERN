import { EntityRepository, MongoRepository } from 'typeorm';
import { LogView } from '../models/LogView';

@EntityRepository(LogView)
export class LogViewRepository extends MongoRepository<LogView>  {

}