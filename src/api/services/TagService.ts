import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { TagRepository } from '../repositories/TagRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Tag } from '../models/Tag';

@Service()
export class TagService {

    constructor(@OrmRepository() private tagRepository: TagRepository, @Logger(__filename) private log: LoggerInterface) { }

    public find(findCondition: any): Promise<any> {
        this.log.info('Find Condition Category');
        return this.tagRepository.find(findCondition);
    }
    
    public findAll(): Promise<any> {
        this.log.info('Find All Category');
        return this.tagRepository.find();
    }

    public findOne(findCondition: any): Promise<any> {
        this.log.info('Find Condition Category');
        return this.tagRepository.findOne(findCondition);
    }

    public async create(tag: Tag): Promise<Tag> {
        this.log.info('Create Tag');
        return await this.tagRepository.save(tag);
    }

    public update(query: any, newValue: any): Promise<any> {
        this.log.info('Update Tag');
        return this.tagRepository.updateOne(query, newValue);
    }

    public updateMany(query: any, newValue: any): Promise<any> {
        this.log.info('Update Many Article');
        return this.tagRepository.updateMany(query, newValue);
    }

    public async deleteOne(query: any, options?: any): Promise<any> {
        this.log.info('Delete Tag');
        return await this.tagRepository.deleteOne(query, options);
    }

}