import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { SearchUtil } from '../../utils/SearchUtil';

@Service()
export class UserService {

    constructor(@OrmRepository() private userRepository: UserRepository, @Logger(__filename) private log: LoggerInterface) { }

    // find user
    public find(findCondition: any): Promise<any[]> {
        this.log.info('Find All User');
        return this.userRepository.find(findCondition);
    }

    // find user
    public findAll(): Promise<any> {
        this.log.info('FindAll User');
        return this.userRepository.find();
    }

    // find user
    public findOne(findCondition: any): Promise<any> {
        this.log.info('Find User');
        return this.userRepository.findOne(findCondition);
    }

    // create user
    public async create(user: User): Promise<User> {
        this.log.info('Create User');
        return await this.userRepository.save(user);
    }

    // update user
    public update(query: any, newValue: any): Promise<any> {
        this.log.info('Update User');
        return this.userRepository.updateOne(query, newValue);
    }

    public updateMany(query: any, newValue: any): Promise<any> {
        this.log.info('Update Many User');
        return this.userRepository.updateMany(query, newValue);
    }

    // delete user
    public async delete(query: any, options?: any): Promise<any> {
        this.log.info('Delete User');
        return await this.userRepository.deleteOne(query, options);
    }

    // find user
    public distinct(key: any, query: any, options?: any): Promise<any> {
        this.log.info('Find All User');
        return this.userRepository.distinct(key, query, options);
    }

    // find user
    public aggregate(query: any, options?: any): Promise<any[]> {
        this.log.info('Find All User');
        return this.userRepository.aggregate(query, options).toArray();
    }

    // Search Page
    public search(limit: number, offset: number, select: any = [], relation: any[], whereConditions: any = [], orderBy: any, count: boolean): Promise<any> {
        const condition: any = SearchUtil.createFindCondition(limit, offset, select, relation, whereConditions, orderBy);

        if (count) {
            return this.userRepository.count();
        } else {
            return this.userRepository.find(condition);
        }
    }

    public cleanUserField(user: any): any {
        if (user !== undefined && user !== null) {
            const clearItem = {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                type: user.type,
                image: user.image,
                nickname: user.nickname
            };
            user = clearItem;
        }
        return user;
    }

    public cleanUsersField(users: any): any {
        const userList = [];
        for (let user of users) {
            if (user !== undefined && user !== null) {
                const clearItem = {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    type: user.type,
                    image: user.image,
                    nickname: user.nickname
                };
                user = clearItem;
            }
            userList.push(user);
        }

        return userList;
    }

    public formatUserForManageAdmin(user: any): any {
        if (user !== undefined && user !== null) {
            const formated = new Array();
            for (const item of user) {
                const element = {
                    id: item.id,
                    username: item.username,
                    firstname: item.firstname,
                    lastname: item.lastname,
                    nickname: item.nickname,
                    email: item.email,
                    type: item.type,
                    password: '**********',
                    image: '/image/user/' + item.id
                };
                formated.push(element);
            }
            return formated;
        }
        return user;
    }
    
}