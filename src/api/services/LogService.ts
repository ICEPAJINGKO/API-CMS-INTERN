import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { LogRepository } from '../repositories/LogRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Log } from '../models/Log';

@Service()
export class LogService {

    constructor(@OrmRepository() private logRepository: LogRepository, @Logger(__filename) private log: LoggerInterface) { }

    public find(findCondition: any): Promise<any> {
        this.log.info('Find Condition Log');
        return this.logRepository.find(findCondition);
    }
    
    public findAll(): Promise<any> {
        this.log.info('Find All Log');
        return this.logRepository.find();
    }

    public findOne(findCondition: any): Promise<any> {
        this.log.info('Find Condition Log');
        return this.logRepository.findOne(findCondition);
    }

    public async create(log: Log): Promise<Log> {
        this.log.info('Create Log');
        if (log.date === undefined || log.date == null || log.time === undefined || log.time == null) {
            const date: Date = new Date();
            const time: Date = new Date(date);
            date.setDate(date.getDate() + 1);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            time.setDate(1);
            time.setMonth(0);
            time.setFullYear(2000);
            if (log.date === undefined || log.date == null) {
                log.date = date;
            }
            if (log.time === undefined || log.time == null) {
                log.time = time;
            }
        }
        
        return await this.logRepository.save(log);
    }

    public update(query: any, newValue: any): Promise<any> {
        this.log.info('Update One Log');
        return this.logRepository.updateOne(query, newValue);
    }

    public updateMany(query: any, newValue: any): Promise<any> {
        this.log.info('Update Many Log');
        return this.logRepository.updateMany(query, newValue);
    }

    public async delete(query: any, options?: any): Promise<any> {
        this.log.info('Delete Log');
        return await this.logRepository.deleteOne(query, options);
    }

    public async deleteMany(query: any, options?: any): Promise<any> {
        this.log.info('Delete Log');
        return await this.logRepository.deleteMany(query, options);
    }

    // Join Collection
    public aggregate(query: any, options?: any): Promise<any[]> {
        this.log.info('Join Collection Log');
        return this.logRepository.aggregate(query, options).toArray();
    }

    public formatLogField(log: any): any {
        if (log !== undefined) {
            const formattedLog: any[] = new Array();
            for (const item of log) {
                const formatItem = {
                    id: item._id,
                    action: item.action,
                    collection: item.collection,
                    document: item.document,
                    description: item.description,
                    date: item.date,
                    time: item.time,
                    user_id: item.user_id,
                    user_nickname: item.user[0].nickname
                };

                formattedLog.push(formatItem);
            }
            
            return formattedLog;
        }else{
            return log;
        }
    }
}