import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Article } from '../models/Article';
import { ArticleRepository } from '../repositories/ArticleRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';

@Service()
export class ArticleService {

    constructor(@OrmRepository() private articleRepository:ArticleRepository, @Logger(__filename) private log: LoggerInterface) { }

    public find(findCondition: any): Promise<any[]> {
        this.log.info('Find Article');
        return this.articleRepository.find(findCondition);
    }

    public findAll(): Promise<any> {
        this.log.info('Find All Article');
        return this.articleRepository.find();
    }

    public findOne(findCondition: any): Promise<any> {
        this.log.info('Find One Article');
        return this.articleRepository.findOne(findCondition);
    }

    public async create(article: Article): Promise<Article> {
        this.log.info('Create Article');
        return await this.articleRepository.save(article);
    }

    public updateAny(query: any, update: any): Promise<any> {
        this.log.info('Update One Article');
        return this.articleRepository.update(query, update);
    }

    public update(query: any, newValue: any): Promise<any> {
        this.log.info('Update One Article');
        return this.articleRepository.updateOne(query, newValue);
    }

    public update2(query: any, newValue: any, options: any): Promise<any> {
        this.log.info('Update One Article');
        return this.articleRepository.updateOne(query, newValue, options);
    }

    public updateMany(query: any, newValue: any): Promise<any> {
        this.log.info('Update Many Article');
        return this.articleRepository.updateMany(query, newValue);
    }

    public updateMany2(query: any, newValue: any, options: any): Promise<any> {
        this.log.info('Update Many Article');
        return this.articleRepository.updateMany(query, newValue, options);
    }

    public async delete(query: any, options?: any): Promise<any> {
        this.log.info('Delete Article');
        return await this.articleRepository.deleteMany(query, options);
    }

    public async deleteOne(query: any, options?: any): Promise<any> {
        this.log.info('Delete One Article');
        return await this.articleRepository.deleteOne(query, options);
    }

    // Join Collection
    public aggregate(query: any, options?: any): Promise<any[]> {
        this.log.info('Join Collection Article');
        return this.articleRepository.aggregate(query, options).toArray();
    }

    public formatArticleSearch(article: any): any {
        this.log.info('Format Article Join Article');
        if (article !== undefined) {
            const formattedArticle: any[] = new Array();
            for (const item of article) {
                const formatItem = {
                    id: item._id,
                    title: item.title,
                    pre_content: item.pre_content,
                    cover_image: '/image/article/' + item._id,
                    publish_datetime: item.publish_datetime
                };

                formattedArticle.push(formatItem);
            }
            
            return formattedArticle;
        }else{
            return article;
        }
    }

    public formatArticleSearchAdmin(article: any): any {
        this.log.info('Format Article Join Article');
        if (article !== undefined) {
            const formattedArticle: any[] = new Array();
            for (const item of article) {
                const formatItem = {
                    id: item._id,
                    title: item.title,
                    pre_content: item.pre_content,
                    publish_datetime: item.publish_datetime,
                    user_nickname: item.user[0].nickname,
                    category_name: item.category[0].name,
                    status: item.status,
                    pin_ordering: item.pin_ordering
                };

                formattedArticle.push(formatItem);
            }
            
            return formattedArticle;
        }else{
            return article;
        }
    }

    public formatArticleJoin(article: any): any {
        this.log.info('Format Article Join Article');
        if (article !== undefined) {
            const formattedArticle: any[] = new Array();
            for (const item of article) {
                const formatItem = {
                    id: item._id,
                    title: item.title,
                    category_id: item.category_id,
                    category_name: item.category[0].name,
                    content: item.content,
                    pre_content: item.pre_content,
                    cover_image: '/image/article/' + item._id,
                    tag: item.tag,
                    url_video: item.url_video,
                    status: item.status,
                    user_id: item.user_id,
                    user_nickname: item.user[0].nickname,
                    create_date: item.create_date,
                    create_time: item.create_time,
                    update_date: item.update_date,
                    update_time: item.update_time,
                    publish_datetime: item.publish_datetime,
                    viewer_count: item.viewer_count,
                    pin_ordering: item.pin_ordering
                };

                formattedArticle.push(formatItem);
            }
            
            return formattedArticle;
        }else{
            return article;
        }
    }

    public formatArticleJoinAdmin(article: any): any {
        this.log.info('Format Article Join Article');
        if (article !== undefined) {
            const formattedArticle: any[] = new Array();
            for (const item of article) {
                const formatItem = {
                    id: item._id,
                    title: item.title,
                    category_id: item.category_id,
                    category_name: item.category[0].name,
                    content: item.content,
                    pre_content: item.pre_content,
                    tag: item.tag,
                    url_video: item.url_video,
                    status: item.status,
                    user_id: item.user_id,
                    user_nickname: item.user[0].nickname,
                    create_date: item.create_date,
                    create_time: item.create_time,
                    update_date: item.update_date,
                    update_time: item.update_time,
                    publish_datetime: item.publish_datetime,
                    viewer_count: item.viewer_count
                };

                formattedArticle.push(formatItem);
            }
            
            return formattedArticle;
        }else{
            return article;
        }
    }
}