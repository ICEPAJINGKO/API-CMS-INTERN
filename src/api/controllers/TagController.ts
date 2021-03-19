import 'reflect-metadata';
import { JsonController, Res, Req, Get, Post, Put, Body, Delete, Param, QueryParam } from 'routing-controllers';
import { Tag } from '../models/Tag';
import { TagService } from '../services/TagService';
import { ResponseUtil } from '../../utils/ResponseUtil';
import { CreateTagRequest } from './requests/CreateTagRequest';
import { UpdateTagRequest } from './requests/UpdateTagRequest';
import { ObjectID } from 'mongodb';
import { LogService } from '../services/LogService';
import { Log } from '../models/Log';
import { UserService } from '../services/UserService';
import { ArticleService } from '../services/ArticleService';

@JsonController('/tag')
export class TagController {
    constructor(
        private tagService: TagService,
        private logService: LogService,
        private userService: UserService,
        private articleService: ArticleService) {
    }
    
    @Get()
    public async tag(@Req() request: any, @Res() response: any): Promise<any> {
        const allTag = await this.tagService.findAll();
        return response.status(200).send(allTag);
    }

    @Post()
    public async createTag(@Body({ validate: true }) body: CreateTagRequest, @Res() response: any, @Req() req: any): Promise<any> {
        const dataName: Tag = await this.tagService.findOne({ where: { name: body.name } });
        if (dataName) {
            const errorResponse = ResponseUtil.getErrorResponse('This TagName already exists', dataName);
            return response.status(400).send(errorResponse);
        }
        
        const tag: Tag = new Tag();
        tag.name = body.name;
        const result = await this.tagService.create(tag);

        if (result) {
            const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});

            const log: Log = new Log();
            log.action = 'create';
            log.collection = 'tag';
            log.document = new ObjectID(result.id);
            log.description = owner.firstname + ' สร้างแท็ก ' + result.name;
            log.user_id = new ObjectID(body.user_id);
            
            await this.logService.create(log);
            const successResponse = ResponseUtil.getSuccessResponse('Create Success', result);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('Create Failed', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    @Put('/:tagId')
    public async updateTag(@Param('tagId') tagId: string,@Body({ validate: true }) body: UpdateTagRequest, @Req() request: any, @Res() response: any): Promise<any> {

        const checkName = await this.tagService.findOne({name: body.name});

        if (checkName) {
            if (checkName.id.toString() !== tagId) {
                const errorResponse = ResponseUtil.getErrorResponse('This tag name is already', checkName);
                return response.status(400).send(errorResponse);
            }
        }
            
        const result = await this.tagService.update(
            { '_id' : new ObjectID(tagId) },
            { $set: {   
                            'name': body.name
                    }
            });
        if (result) {
            const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});
        
            const log: Log = new Log();
            log.action = 'update';
            log.collection = 'tag';
            log.document = new ObjectID(tagId);
            log.description = owner.firstname + ' แก้ไขแท็ก ' + result.name;
            log.user_id = new ObjectID(body.user_id);
                    
            await this.logService.create(log);
            const successResponse = ResponseUtil.getSuccessResponse('Update Success', result);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('Update Failed', undefined);
            return response.status(400).send(errorResponse);
        }

    }

    @Delete('/:tagId')
    public async deleteTag(@Param('tagId') tagId: string,@QueryParam('user_id') user_id: string,@Req() request: any, @Res() response: any): Promise<any> {
        if (tagId !== undefined && tagId !== null && tagId !== '') {
            if (user_id === undefined || user_id == null || user_id === '') {
                const errorResponse = ResponseUtil.getErrorResponse('user_id Failed', undefined);
                return response.status(400).send(errorResponse);
            }
            const tag = await this.tagService.findOne({_id : new ObjectID(tagId)});
            const result = await this.tagService.deleteOne({_id : new ObjectID(tagId)});
            if (result) {
                await this.articleService.updateMany2(
                        { },
                        { $pull: { tag_id: new ObjectID(tagId) } },
                        { multi: true }
                    );

                const owner = await this.userService.findOne({_id : new ObjectID(user_id)});

                const log: Log = new Log();
                log.action = 'delete';
                log.collection = 'tag';
                log.document = new ObjectID(tag.id);
                log.description = owner.firstname + ' ลบแท็ก ' + tag.name + ' และได้ลบแท็กนี้ที่ติดไว้ในบทความออกทั้งหมด';
                log.user_id = new ObjectID(user_id);
                
                await this.logService.create(log);
                const successResponse = ResponseUtil.getSuccessResponse('Delete Success', result);
                return response.status(200).send(successResponse);
            } else {
                const errorResponse = ResponseUtil.getErrorResponse('Delete Failed', undefined);
                return response.status(400).send(errorResponse);
            }
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('tagId Failed', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    @Get('/test/test')
    public async testTag(@Req() request: any, @Res() response: any): Promise<any> {
        
        const updateArticle = await this.tagService.updateMany(
            { 'is_deleted': true },
            { $set: {   
                        'is_deleted': false
                    }
            });
        
        return response.status(200).send(updateArticle);
    }
}