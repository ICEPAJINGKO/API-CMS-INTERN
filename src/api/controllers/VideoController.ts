import 'reflect-metadata';
import { JsonController, Res, Req, Get, Post, Body, QueryParam, Delete, Put, Param } from 'routing-controllers';
import { Video } from '../models/Video';
import { VideoService } from '../services/VideoService';
import { ResponseUtil } from '../../utils/ResponseUtil';
import { CreateVideoRequest } from './requests/CreateVideoRequest';
import { UpdateVideoRequest } from './requests/UpdateVideoRequest';
import { ObjectID } from 'mongodb';
import { LogService } from '../services/LogService';
import { Log } from '../models/Log';
import { UserService } from '../services/UserService';

@JsonController('/video')
export class VideoController {
    constructor(
        private videoService: VideoService,
        private logService: LogService,
        private userService: UserService) {
    }

    @Get()
    public async Video(@Req() request: any, @Res() response: any): Promise<any> {
        const allVideo = await this.videoService.findAll();
        return response.status(200).send(allVideo);
    }

    @Post()
    public async createVideo(@Body({ validate: true }) body: CreateVideoRequest, @Res() res: any, @Req() req: any): Promise<any> {
        const video: Video = new Video();
        video.name = body.name;
        video.url = body.url;
        video.description = body.description;
        video.ordering = 0;
        video.active = true;
        const result = await this.videoService.create(video);

        if (result) {
            const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});

            const log: Log = new Log();
            log.action = 'create';
            log.collection = 'video';
            log.document = new ObjectID(result.id);
            log.description = owner.firstname + ' สร้างวีดีโอ ' + result.name;
            log.user_id = new ObjectID(body.user_id);
            
            await this.logService.create(log);
            const successResponse = ResponseUtil.getSuccessResponse('Create Success', result);
            return res.status(200).send(successResponse);
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('Create Failed', undefined);
            return res.status(400).send(errorResponse);
        }
    }

    @Put('/:videoId')
    public async updateVideo(@Param('videoId') videoId: string,@Body({ validate: true }) body: UpdateVideoRequest,@Req() request: any, @Res() response: any): Promise<any> {
        
        if (videoId !== undefined && videoId !== null && videoId !== '') {
            const result = await this.videoService.update({ '_id' : new ObjectID(videoId) },
                { $set: {   'name': body.name,
                            'url': body.url,
                            'description': body.description }});
            if (result) {
                const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});
        
                const log: Log = new Log();
                log.action = 'update';
                log.collection = 'video';
                log.document = new ObjectID(result.id);
                log.description = owner.firstname + ' แก้ไขวีดีโอ ' + result.name;
                log.user_id = new ObjectID(body.user_id);
                    
                await this.logService.create(log);
                const successResponse = ResponseUtil.getSuccessResponse('Update Success', result);
                return response.status(200).send(successResponse);
            } else {
                const errorResponse = ResponseUtil.getErrorResponse('Update Failed', undefined);
                return response.status(400).send(errorResponse);
            }
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('videoId Failed', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    @Delete('/:videoId')
    public async deleteVideo(@Param('videoId') videoId: string,@QueryParam('user_id') user_id: string,@Req() request: any, @Res() response: any): Promise<any> {
        if (videoId !== undefined && videoId !== null && videoId !== '') {
            const result = await this.videoService.deleteOne({'_id': new ObjectID(videoId)});
            if (result) {
                const owner = await this.userService.findOne({_id : new ObjectID(user_id)});
                
                const log: Log = new Log();
                log.action = 'delete';
                log.collection = 'video';
                log.document = new ObjectID(result.id);
                log.description = owner.firstname + ' ลบวีดีโอ ' + result.name;
                log.user_id = new ObjectID(user_id);
                
                await this.logService.create(log);
                const successResponse = ResponseUtil.getSuccessResponse('Delete Success', result);
                return response.status(200).send(successResponse);
            } else {
                const errorResponse = ResponseUtil.getErrorResponse('Delete Failed', result);
                return response.status(400).send(errorResponse);
            }
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('videoId Failed', undefined);
            return response.status(400).send(errorResponse);
        }
    }
}