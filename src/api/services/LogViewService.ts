import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { LogViewRepository } from '../repositories/LogViewRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { LogView } from '../models/LogView';

@Service()
export class LogViewService {

    constructor(@OrmRepository() private logViewRepository: LogViewRepository, @Logger(__filename) private log: LoggerInterface) { }

    public find(findCondition: any): Promise<any> {
        this.log.info('Find Condition Category');
        return this.logViewRepository.find(findCondition);
    }
    
    public findAll(): Promise<any> {
        this.log.info('Find All Category');
        return this.logViewRepository.find();
    }

    public findOne(findCondition: any): Promise<any> {
        this.log.info('Find Condition Category');
        return this.logViewRepository.findOne(findCondition);
    }

    public async create(log: LogView): Promise<LogView> {
        this.log.info('Create Log');
        return await this.logViewRepository.save(log);
    }
}