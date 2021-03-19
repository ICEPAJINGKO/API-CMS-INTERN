import 'reflect-metadata';
import { JsonController, Res, Req, Get, Post, Body, QueryParam, Delete, Put, Param } from 'routing-controllers';
import { Article } from '../models/Article';
import { ArticleService } from '../services/ArticleService';
import { ResponseUtil } from '../../utils/ResponseUtil';
import { CreateArticleRequest } from './requests/CreateArticleRequest';
import { UpdateArticleRequest } from './requests/UpdateArticleRequest';
import { UpdateArticlePinRequest } from './requests/UpdateArticlePinRequest';
import { ObjectID } from 'mongodb';
import { LogService } from '../services/LogService';
import { Log } from '../models/Log';
import { UserService } from '../services/UserService';

@JsonController('/article')
export class ArticleController {

    constructor(
        private articleService: ArticleService,
        private logService: LogService,
        private userService: UserService) {
    }

    @Get()
    public async userArticle(@QueryParam('mode') mode: string,@QueryParam('keyword') keyword: string,
                         @QueryParam('category') category: string,@QueryParam('tag') tag: string,
                         @QueryParam('startdate') startdate: string,@QueryParam('enddate') enddate: string,
                         @QueryParam('owner') owner: string,@QueryParam('orderby') orderby: string,
                         @QueryParam('limit') limit: number,@QueryParam('skip') skip: number,
                         @Req() request: any, @Res() response: any): Promise<any> {
        console.log('Article User Mode -- Article User Mode -- Article User Mode -- Article User Mode');
        if (mode !== undefined) {
            if (mode === 'pin') {
                const pinArticle = await this.articleService.aggregate([
                    { 
                        $match: 
                            {
                                pin: true, 
                                is_deleted: false, 
                                status: 'public'
                            }
                    },
                    {
                        $sort: 
                            {
                                pin_ordering : 1
                            }
                    }
                ]);
                const result = this.articleService.formatArticleSearch(pinArticle);
                return response.status(200).send(result);
            }
            if (mode === 'new') {
                const newArticle = await this.articleService.aggregate([
                    { 
                        $match: 
                            {
                                is_deleted: false, 
                                status: 'public'
                            }
                    },
                    {
                        $sort: 
                            {
                                publish_datetime : 1
                            }
                    }
                ]);
                const result = this.articleService.formatArticleSearch(newArticle);
                return response.status(200).send(result);
            }
            if (mode === 'popofweek') {
                const popofweekArticle = await this.articleService.aggregate([
                    { 
                        $match: 
                            {
                                is_deleted: false, 
                                status: 'public'
                            }
                    },
                    {
                        $sort: 
                            {
                                viewer_count : -1
                            }
                    }
                ]);
                const result = this.articleService.formatArticleSearch(popofweekArticle);
                return response.status(200).send(result);
            }
            if (mode === 'topview') {
                const popofweekArticle = await this.articleService.aggregate([
                    { 
                        $match: 
                            {
                                is_deleted: false, 
                                status: 'public'
                            }
                    },
                    {
                        $sort: 
                            {
                                viewer_count : 1
                            }
                    },
                    {
                        $skip: 1
                    }
                ]);
                const result = this.articleService.formatArticleSearch(popofweekArticle);
                return response.status(200).send(result);
            }

            const errorResponse = ResponseUtil.getErrorResponse('Mode Failed', undefined);
            return response.status(400).send(errorResponse);

        } else if (keyword !== undefined || category !== undefined || tag !== undefined || startdate !== undefined || 
                  enddate !== undefined || owner !== undefined || orderby !== undefined || limit !== undefined) {
            console.log('Article มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข');
            
            const aggregate: any[] = new Array();
            
            const matchObj: any = { $match: {} };
            matchObj.$match.status = 'public';
            matchObj.$match.is_deleted = false;
            if ((category !== undefined && category !== null) || (tag !== undefined && tag !== null) || 
                (owner !== undefined && owner !== null) || (keyword !== undefined && keyword !== null)) {
                if (category !== undefined && category !== null) {
                    matchObj.$match.category_id = new ObjectID(category);
                }
                if (tag !== undefined && tag !== null) {
                    matchObj.$match.tag_id = new ObjectID(tag);
                }
                if (owner !== undefined && owner !== null) {
                    matchObj.$match.user_id = new ObjectID(owner);
                }
                if ((startdate !== undefined && startdate !== null) || (enddate !== undefined && enddate !== null)) {
                    matchObj.$match.publish_datetime = {$gte: new Date(startdate), $lt: new Date(enddate)};
                }
                if (keyword !== undefined && keyword !== null) {
                    const or: any[] = [
                                        {title: {$regex: keyword}},
                                        {content: {$regex: keyword}},
                                        {pre_content: {$regex: keyword}}
                                      ];
                    matchObj.$match.$or = or;
                }

                aggregate.push(matchObj);
            }

            let sortObj: any = {};
            if (orderby !== undefined && orderby !== null) {
                if (orderby === 'new') {
                    sortObj = {
                        $sort : { publish_datetime : -1 }
                    };
                }
                if (orderby === 'old') {
                    sortObj = {
                        $sort : { publish_datetime : 1 }
                    };
                }
                if (orderby === 'popular') {
                    sortObj = {
                        $sort : { viewer_count : -1 }
                    };
                }
                aggregate.push(sortObj);
            }

            const skipObj: any = {};
            if (skip !== undefined && skip !== null) {
                skipObj.$skip = skip;
                aggregate.push(skipObj);
            }

            const limitObj: any = {};
            if (limit !== undefined && limit !== null) {
                limitObj.$limit = limit;
                aggregate.push(limitObj);
            }

            // return response.status(200).send(aggregate);
            const joinArticle = await this.articleService.aggregate(aggregate);
            const result = this.articleService.formatArticleSearch(joinArticle);
            return response.status(200).send(result);

        } else {
            console.log('Article ยิงรวมทุกอันมาทุกสิ่ง ยิงรวมทุกอันมาทุกสิ่ง ยิงรวมทุกอันมาทุกสิ่ง ยิงรวมทุกอันมาทุกสิ่ง ยิงรวมทุกอันมาทุกสิ่ง ยิงรวมทุกอันมาทุกสิ่ง');
            const joinArticle = await this.articleService.aggregate(
                [
                    { 
                        $match: 
                            {
                                is_deleted: false,
                                status: 'public'
                            }
                    },
                    {
                        $lookup:
                            {
                                from: 'category',
                                localField: 'category_id',
                                foreignField: '_id',
                                as: 'category'
                            }
                    },
                    {
                        $lookup:
                            {
                                from: 'user',
                                localField: 'user_id',
                                foreignField: '_id',
                                as: 'user'
                            }
                    },
                    {
                        $lookup:
                            {
                                from: 'tag',
                                localField: 'tag_id',
                                foreignField: '_id',
                                as: 'tag'
                            }
                    }
                ]
            );
            const result = this.articleService.formatArticleSearch(joinArticle);
            return response.status(200).send(result);
        }
    }

    @Get('/admin')
    public async adminArticle(@QueryParam('mode') mode: string,@QueryParam('keyword') keyword: string,
                         @QueryParam('category') category: string,@QueryParam('tag') tag: string,
                         @QueryParam('startdate') startdate: string,@QueryParam('enddate') enddate: string,
                         @QueryParam('owner') owner: string,@QueryParam('orderby') orderby: string,
                         @QueryParam('limit') limit: number,@QueryParam('skip') skip: number,
                         @Req() request: any, @Res() response: any): Promise<any> {      
        console.log('Article Admin Mode -- Article Admin Mode -- Article Admin Mode -- Article Admin Mode');  
        if (mode !== undefined) {

            if (mode === 'pin') {
                const pinArticle = await this.articleService.find({ pin: true, is_deleted: false });
                return response.status(200).send(pinArticle);
            }

        } else if (keyword !== undefined || category !== undefined || tag !== undefined || startdate !== undefined || 
                  enddate !== undefined || owner !== undefined || orderby !== undefined || limit !== undefined) {
            console.log('Article มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข มีเงื่อนไข');
            
            const aggregate: any[] = new Array();
            
            const matchObj: any = { $match: {} };
            matchObj.$match.is_deleted = false;
            if ((category !== undefined && category !== null) || (tag !== undefined && tag !== null) || 
                (owner !== undefined && owner !== null) || (keyword !== undefined && keyword !== null)) {
                if (category !== undefined && category !== null) {
                    matchObj.$match.category_id = new ObjectID(category);
                }
                if (tag !== undefined && tag !== null) {
                    matchObj.$match.tag_id = new ObjectID(tag);
                }
                if (owner !== undefined && owner !== null) {
                    matchObj.$match.user_id = new ObjectID(owner);
                }
                if ((startdate !== undefined && startdate !== null) || (enddate !== undefined && enddate !== null)) {
                    matchObj.$match.publish_datetime = {$gte: new Date(startdate), $lt: new Date(enddate)};
                }
                if (keyword !== undefined && keyword !== null) {
                    const or: any[] = [
                                        {title: {$regex: keyword}},
                                        {content: {$regex: keyword}},
                                        {pre_content: {$regex: keyword}}
                                      ];
                    matchObj.$match.$or = or;
                }

                aggregate.push(matchObj);
            }

            let sortObj: any = {};
            if (orderby !== undefined && orderby !== null) {
                if (orderby === 'new') {
                    sortObj = {
                        $sort : { publish_datetime : -1 }
                    };
                }
                if (orderby === 'old') {
                    sortObj = {
                        $sort : { publish_datetime : 1 }
                    };
                }
                if (orderby === 'popular') {
                    sortObj = {
                        $sort : { viewer_count : -1 }
                    };
                }
                aggregate.push(sortObj);
            }

            const skipObj: any = {};
            if (skip !== undefined && skip !== null) {
                skipObj.$skip = skip;
                aggregate.push(skipObj);
            }

            const limitObj: any = {};
            if (limit !== undefined && limit !== null) {
                limitObj.$limit = limit;
                aggregate.push(limitObj);
            }

            aggregate.push({
                                $lookup:
                                    {
                                        from: 'category',
                                        localField: 'category_id',
                                        foreignField: '_id',
                                        as: 'category'
                                    }
                            },
                            {
                                $lookup:
                                    {
                                        from: 'user',
                                        localField: 'user_id',
                                        foreignField: '_id',
                                        as: 'user'
                                    }
                            });

            // return response.status(200).send(aggregate);
            const joinArticle = await this.articleService.aggregate(aggregate);
            const result = this.articleService.formatArticleSearchAdmin(joinArticle);
            return response.status(200).send(result);

        } else {
            console.log('Article ยิงรวมทุกอันมาทุกสิ่ง ยิงรวมทุกอันมาทุกสิ่ง ยิงรวมทุกอันมาทุกสิ่ง ยิงรวมทุกอันมาทุกสิ่ง ยิงรวมทุกอันมาทุกสิ่ง ยิงรวมทุกอันมาทุกสิ่ง');
            const joinArticle = await this.articleService.aggregate(
                [
                    { 
                        $match: 
                            {
                                is_deleted: false
                            }
                    },
                    {
                        $lookup:
                            {
                                from: 'category',
                                localField: 'category_id',
                                foreignField: '_id',
                                as: 'category'
                            }
                    },
                    {
                        $lookup:
                            {
                                from: 'user',
                                localField: 'user_id',
                                foreignField: '_id',
                                as: 'user'
                            }
                    }
                ]
            );
            const result = this.articleService.formatArticleSearchAdmin(joinArticle);
            return response.status(200).send(result);
        }
    }

    @Get('/:articleId')
    public async articleOne(@Param('articleId') articleId: string,@Req() request: any, @Res() response: any): Promise<any> {     

        console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz');
        
        if (articleId !== undefined && articleId !== null) {
            console.log(articleId);
            const joinArticle = await this.articleService.aggregate(
                [
                    { 
                        $match: 
                            {
                                _id: new ObjectID(articleId),
                                is_deleted: false
                            } 
                    },
                    {
                        $lookup:
                            {
                                from: 'category',
                                localField: 'category_id',
                                foreignField: '_id',
                                as: 'category'
                            }
                    },
                    {
                        $lookup:
                            {
                                from: 'user',
                                localField: 'user_id',
                                foreignField: '_id',
                                as: 'user'
                            }
                    },
                    {
                        $lookup:
                            {
                                from: 'tag',
                                localField: 'tag_id',
                                foreignField: '_id',
                                as: 'tag'
                            }
                    }
                ]
            );
            const article = this.articleService.formatArticleJoin(joinArticle);
            if (article) {
                return response.status(200).send(article);
            } else {
                return response.status(404).send('ERROR 404: NOT FOUND');
            }
            
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('articleId Failed', undefined);
            return response.status(400).send(errorResponse);
        }
        
    }

    @Post()
    public async createArticle(@Body({ validate: true }) body: CreateArticleRequest, @Res() response: any, @Req() req: any): Promise<any> {

        const date: Date = new Date();
        const time: Date = new Date(date);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        time.setDate(1);
        time.setMonth(0);
        time.setFullYear(2000);

        for (let i = 0; i < body.tag_id.length; i++) {
            body.tag_id.push(new ObjectID(body.tag_id[0]));
            body.tag_id.shift();
        }

        const article: Article = new Article();
        article.title = body.title;
        article.category_id = new ObjectID(body.category_id);
        article.content = body.content;
        article.pre_content = body.pre_content;
        article.cover_image = body.cover_image;
        article.tag_id = body.tag_id;
        article.url_video = body.url_video;
        article.status = body.status.toLowerCase();
        article.user_id = new ObjectID(body.user_id);
        article.create_date = date;
        article.create_time = time;
        article.update_date = date;
        article.update_time = time;
        article.publish_datetime = new Date(body.publish_datetime);
        article.viewer_count = 0;
        article.pin = false;
        article.pin_ordering = 0;
        article.is_deleted = false;
        const result = await this.articleService.create(article);

        if (result) {
            const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});

            const log: Log = new Log();
            log.action = 'create';
            log.collection = 'article';
            log.document = new ObjectID(result.id);
            log.description = owner.firstname + ' สร้างบทความ ' + result.title;
            log.user_id = new ObjectID(body.user_id);
            log.date = date;
            log.time = time;
            
            await this.logService.create(log);
            const successResponse = ResponseUtil.getSuccessResponse('Create Success', result);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('Create Failed', undefined);
            return response.status(400).send(errorResponse);
        }

    }

    @Put('/:articleId')
    public async updateArticle(@Param('articleId') articleId: string,@Body({ validate: true }) body: UpdateArticleRequest,@Req() request: any, @Res() response: any): Promise<any> {
        
        const date: Date = new Date();
        const time: Date = new Date(date);
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
        time.setDate(1);
        time.setMonth(0);
        time.setFullYear(2000);

        let pin = false;
        const pin_ordering = body.pin_ordering;
        if (pin_ordering !== 0) {
            pin = true;
        }

        for (let i = 0; i < body.tag_id.length; i++) {
            body.tag_id.push(new ObjectID(body.tag_id[0]));
            body.tag_id.shift();
        }
        
        const result = await this.articleService.update(
            { '_id' : new ObjectID(articleId) },
            { $set: {   
                        'title': body.title,
                        'category_id': new ObjectID(body.category_id),
                        'content': body.content,
                        'pre_content': body.pre_content,
                        'tag_id': body.tag_id,
                        'url_video': body.url_video,
                        'status': body.status,
                        'update_date': date,
                        'update_time': time,
                        'publish_datetime': new Date(body.publish_datetime),
                        'pin': pin,
                        'pin_ordering': pin_ordering
                    }
            });

        if (body.cover_image !== undefined && body.cover_image !== '') {
            await this.articleService.update(
                { '_id' : new ObjectID(articleId) },
                { $set: {   
                            'cover_image': body.cover_image
                        }
                });
        }
            if (result) {
                const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});
                
                const log: Log = new Log();
                log.action = 'update';
                log.collection = 'article';
                log.document = new ObjectID(articleId);
                log.description = owner.firstname + ' แก้ไขบทความ ' + body.title;
                log.user_id = new ObjectID(body.user_id);
                log.date = date;
                log.time = time;
                
                await this.logService.create(log);
                const successResponse = ResponseUtil.getSuccessResponse('Register Success', result);
                return response.status(200).send(successResponse);
            } else {
                const errorResponse = ResponseUtil.getErrorResponse('Register Failed', undefined);
                return response.status(400).send(errorResponse);
            }
    }

    @Put('/pin')
    public async updateArticlePin(@Body({ validate: true }) body: UpdateArticlePinRequest,@Req() request: any, @Res() response: any): Promise<any> {
        let pin = false;
        const pin_ordering = body.pin_ordering;
        if (pin_ordering !== 0) {
            pin = true;
        }
        const result = await this.articleService.update(
            { '_id' : new ObjectID(body.id) },
            { $set: {   
                        'pin': pin,
                        'pin_ordering': pin_ordering
                    }
            });
            if (result) {
                const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});
                const article = await this.articleService.findOne({_id : new ObjectID(body.id)});
    
                const log: Log = new Log();
                log.action = 'update';
                log.collection = 'article';
                log.document = new ObjectID(body.id);
                log.description = owner.firstname + ' แก้ไข pin ของ ' + article.title;
                log.user_id = new ObjectID(body.user_id);
                
                await this.logService.create(log);
                const successResponse = ResponseUtil.getSuccessResponse('Register Success', result);
                return response.status(200).send(successResponse);
            } else {
                const errorResponse = ResponseUtil.getErrorResponse('Register Failed', undefined);
                return response.status(400).send(errorResponse);
            }
    }

    @Delete('/:articleId')
    public async deleteArticle(@Param('articleId') articleId: string,@QueryParam('user_id') user_id: string,@Req() request: any, @Res() response: any): Promise<any> {
        if (articleId !== undefined && user_id !== undefined) {
            const result = await this.articleService.update(
                { '_id' : new ObjectID(articleId) },
                { $set: {   
                            'is_deleted': true
                        }
                });
            if (result) {
                const owner = await this.userService.findOne({_id : new ObjectID(user_id)});
                const article = await this.articleService.findOne({_id : new ObjectID(articleId)});
                console.log(owner);
                const log: Log = new Log();
                log.action = 'delete';
                log.collection = 'article';
                log.document = new ObjectID(articleId);
                log.description = owner.firstname + ' ลบหมวดบทความ ' + article.title;
                log.user_id = new ObjectID(user_id);
                await this.logService.create(log);
    
                const successResponse = ResponseUtil.getSuccessResponse('Delete Success', result);
                return response.status(200).send(successResponse);
            } else {
                const errorResponse = ResponseUtil.getErrorResponse('Delete Failed', result);
                return response.status(400).send(errorResponse);
            }
        } else {
            return response.status(400).send('Param articleId or QueryParam user_id is undefined');
        }
    }

    @Get('/test/test')
    public async articleTest(@Req() request: any, @Res() response: any): Promise<any> {
        // const contentType = 'image/png';
        // const result = await this.articleService.findOne({ _id: new ObjectID('60121f7e36185f2c1c4c8260') });
        // const byteCharacters = atob(result.cover_image);
        // const byteNumbers = new Array(byteCharacters.length);
        // for (let i = 0; i < byteCharacters.length; i++) {
        //     byteNumbers[i] = byteCharacters.charCodeAt(i);
        // }
        // const byteArray = new Uint8Array(byteNumbers);
        // const blob = new Blob([byteArray], {type: contentType});
        // return response.status(200).send(blob);

        // return response.status(200).send(timeLong);
        const datexx: Date = new Date('Mon Feb 15 2021 11:14:38 GMT+0700 (Indochina Time)');
        return response.status(200).send(datexx);
    }

    @Put('/test/test')
    public async updateDelete(@Req() request: any, @Res() response: any): Promise<any> {
        const updateArticle = await this.articleService.delete({ 'is_deleted': true }); 
        
        return response.status(200).send(updateArticle);
    }

}