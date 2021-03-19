import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Video } from '../models/Video';
import { VideoRepository } from '../repositories/VideoRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class VideoService {

    constructor(@OrmRepository() private videoRepository: VideoRepository, @Logger(__filename) private log: LoggerInterface) { }

    public find(findCondition: any): Promise<any[]> {
        this.log.info('Find All Video');
        return this.videoRepository.find(findCondition);
    }

    public findAll(): Promise<any> {
        this.log.info('FindAll Video');
        return this.videoRepository.find();
    }

    public findOne(findCondition: any): Promise<any> {
        this.log.info('Find Video');
        return this.videoRepository.findOne(findCondition);
    }

    public async create(video: Video): Promise<Video> {
        this.log.info('Create Video');
        return await this.videoRepository.save(video);
    }

    public update(query: any, newValue: any): Promise<any> {
        this.log.info('Update Video');
        return this.videoRepository.updateOne(query, newValue);
    }

    public async delete(query: any, options?: any): Promise<any> {
        this.log.info('Delete Video');
        return await this.videoRepository.deleteOne(query, options);
    }

    public async deleteOne(query: any, options?: any): Promise<any> {
        this.log.info('Delete Video');
        return await this.videoRepository.deleteOne(query, options);
    }

}