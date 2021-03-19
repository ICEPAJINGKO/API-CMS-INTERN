import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SearchUtil } from '../../utils/SearchUtil';
import { ConfigRepository } from '../repositories/ConfigRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class ConfigService {
    constructor(@OrmRepository() private configRepository: ConfigRepository, @Logger(__filename) private log: LoggerInterface) { }

    public find(findCondition: any): Promise<any> {
        this.log.info('Find Condition Category');
        return this.configRepository.find(findCondition);
    }
    
    public findAll(): Promise<any> {
        this.log.info('Find All Category');
        return this.configRepository.find();
    }

    public findOne(findCondition: any): Promise<any> {
        this.log.info('Find Condition Category');
        return this.configRepository.findOne(findCondition);
    }

    // create config
    public async create(config: any): Promise<any> {
        return await this.configRepository.save(config);
    }

    // edit config
    public async update(query: any, newValue: any): Promise<any> {
        return await this.configRepository.updateOne(query, newValue);
    }

    public async getConfig(name: string): Promise<any> {
        const condition = { name };
        return await this.configRepository.findOne(condition);
    }

    // config List
    public async search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {
        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);
        if (count) {
            return await this.configRepository.count(condition);
        } else {
            return await this.configRepository.find(condition);
        }
    }

    // delete config
    public async delete(query: any, options?: any): Promise<any> {
        return await this.configRepository.deleteOne(query, options);
    }

    public async deleteOne(query: any, options?: any): Promise<any> {
        this.log.info('Delete Config');
        return await this.configRepository.deleteOne(query, options);
    }
}
