import 'reflect-metadata';
import { JsonController, Res, Req, Get, Post, Body, Delete, Put, Param, QueryParam } from 'routing-controllers';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { ResponseUtil } from '../../utils/ResponseUtil';
import { CreateUserRequest } from './requests/CreateUserRequest';
import { UpdateUserRequest } from './requests/UpdateUserRequest';
import { UpdateUserPasswordRequest } from './requests/UpdateUserPasswordRequest';
import { UpdateUserTypeRequest } from './requests/UpdateUserTypeRequest';
import { LoginUserRequest } from './requests/LoginUserRequest';
import { ObjectID } from 'mongodb';
import { LogService } from '../services/LogService';
import { Log } from '../models/Log';

@JsonController('/user')
export class UserController {

    constructor(
        private userService: UserService,
        private logService: LogService) {
    }

    @Get()
    public async user(@QueryParam('keyword') keyword: string,@Req() request: any, @Res() response: any): Promise<any> {        
        
        if (keyword !== undefined) {
            const result = await this.userService.aggregate(
                [
                    {
                        $match: {
                            is_deleted: false,
                            $or : [
                                    {firstname: {$regex: keyword}},
                                    {lastname: {$regex: keyword}},
                                    {nickname: {$regex: keyword}},
                                    {email: {$regex: keyword}}
                                  ]
                        }
                            
                    }
                ]
            );
            return response.status(200).send(result);
        } else {
            let result = await this.userService.find({is_deleted: false});
            result = await this.userService.formatUserForManageAdmin(result);
            return response.status(200).send(result);
        }
        
    }

    @Get('/login')
    public async userLogin(@Body({ validate: true }) body: LoginUserRequest,@Req() request: any, @Res() response: any): Promise<any> {        
        
        const result = await this.userService.findOne({username: body.username, password: body.password});
        console.log(result);
        if (result) {
            return response.status(200).send(true);
        } else {
            return response.status(200).send(false);
        }
        
    }

    @Get('/:userId')
    public async userOne(@Param('userId') userId: string,@Req() request: any, @Res() response: any): Promise<any> {     

        if (userId !== undefined && userId !== null) {
            const result  = await this.userService.findOne({_id: new ObjectID(userId)});
            return response.status(200).send(result);
        } else {
            return response.status(404).send('userId is Incorrect');
        }
        
    }

    @Post()
    public async createUser(@Body({ validate: true }) body: CreateUserRequest, @Res() res: any, @Req() req: any): Promise<any> {

        const errorResponse = ResponseUtil.getErrorResponse('GO TO USE PATH => /auth/register ', undefined);
        return res.status(400).send(errorResponse);
        
        const user: User = new User();
        user.username = body.username;
        user.password = body.password;
        user.firstname = body.firstname;
        user.lastname = body.lastname;
        user.email = body.email;
        user.type = body.type;
        user.image = body.image;
        user.nickname = body.nickname;
        user.is_deleted = false;
        const result = await this.userService.create(user);

        if (result) {
            const successResponse = ResponseUtil.getSuccessResponse('Register Success', result);
            return res.status(200).send(successResponse);
        } else {
            // const errorResponse = ResponseUtil.getErrorResponse('Register Failed', undefined);
            // return res.status(400).send(errorResponse);
        }

    }

    @Put('/:userId')
    public async updateUser(@Param('userId') userId: string,@Body({ validate: true }) body: UpdateUserRequest,@Req() request: any, @Res() response: any): Promise<any> {

        if (userId !== body.user_id) {
            const errorResponse = ResponseUtil.getErrorResponse('Update Failed && U R NOT OWNER U CAN NOT UPDATE', undefined);
            return response.status(400).send(errorResponse);
        }

        const result = await this.userService.update(
            { '_id' : new ObjectID(userId) },
            { $set: {   
                        'username': body.username,
                        'firstname': body.firstname,
                        'lastname': body.lastname,
                        'email': body.email,
                        'nickname': body.nickname
                    }
            });
        
        if (result) {
            if (body.image !== undefined && body.image !== null && body.image !== '') {
                await this.userService.update(
                    { '_id' : new ObjectID(userId) },
                    { $set: {   
                                'image': body.image
                            }
                    });
            }
            const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});
        
            const log: Log = new Log();
            log.action = 'update';
            log.collection = 'user';
            log.document = new ObjectID(userId);
            log.description = owner.firstname + ' แก้ไขผู้ใช้งาน ' + result.name;
            log.user_id = new ObjectID(body.user_id);
            
            await this.logService.create(log);
            const successResponse = ResponseUtil.getSuccessResponse('Update Success', result);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('Update Failed', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    @Put('/:userId/password')
    public async updateUserPassword(@Param('userId') userId: string,@Body({ validate: true }) body: UpdateUserPasswordRequest,@Req() request: any, @Res() response: any): Promise<any> {

        if (userId === body.user_id) {
            
            const oldPassword = body.oldpassword;
            let newPassword = body.newpassword;
            
            if (oldPassword === null && oldPassword === undefined && oldPassword === '') {
                const errorResponse = ResponseUtil.getErrorResponse('Invalid oldPassword', undefined);
                return response.status(400).send(errorResponse);
            }

            if (newPassword === null && newPassword === undefined && newPassword === '') {
                const errorResponse = ResponseUtil.getErrorResponse('Invalid newPassword', undefined);
                return response.status(400).send(errorResponse);
            }

            const userLogin = await this.userService.findOne({ where: { _id: new ObjectID(userId) } });

            if (userLogin) {
                if (await User.comparePassword(userLogin, oldPassword)) {

                    newPassword = await User.hashPassword(newPassword);
        
                    const result = await this.userService.update(
                        { '_id' : new ObjectID(userId) },
                        { $set: {   
                                    'password': newPassword
                                }
                        });
            
                    if (result) {
                        const owner = await this.userService.findOne({_id : new ObjectID(userId)});
                    
                        const log: Log = new Log();
                        log.action = 'update';
                        log.collection = 'user';
                        log.document = new ObjectID(userId);
                        log.description = owner.firstname + ' เปลี่ยนรหัสผ่านใหม่ของ ';
                        log.user_id = new ObjectID(userId);
                        
                        await this.logService.create(log);
                        const successResponse = ResponseUtil.getSuccessResponse('Update Success', result);
                        return response.status(200).send(successResponse);
                    } else {
                        const errorResponse = ResponseUtil.getErrorResponse('Update Failed', undefined);
                        return response.status(400).send(errorResponse);
                    }
        
                } else {
                    const errorResponse = ResponseUtil.getErrorResponse('Invalid oldPassword', undefined);
                    return response.status(400).send(errorResponse);
                }
            } else {
                const errorResponse: any = { status: 0, message: 'Invalid username' };
                return response.status(400).send(errorResponse);
            }

        } else {

            const owner = await this.userService.findOne(new ObjectID(body.user_id));
            const user = await this.userService.findOne(new ObjectID(userId));
            
            if ((user.type === 'superadmin' && owner.typy !== 'superadmin') || 
                (user.type === 'admin' && owner.typy !== 'superadmin') || 
                (user.type === 'auther' && owner.typy === 'auther')) {
                    
                const errorResponse = ResponseUtil.getErrorResponse('You are not allowed', undefined);
                return response.status(400).send(errorResponse);

            }

            let newPassword = body.newpassword;
            newPassword = await User.hashPassword(newPassword);

            const result = await this.userService.update(
                { '_id' : new ObjectID(userId) },
                { $set: {   
                            'password': newPassword
                        }
                });
    
            if (result) {
            
                const log: Log = new Log();
                log.action = 'update';
                log.collection = 'user';
                log.document = new ObjectID(userId);
                log.description = owner.firstname + ' รีเซ็ตรหัสผ่านของ ' + user.firstname;
                log.user_id = new ObjectID(userId);
                
                await this.logService.create(log);
                const successResponse = ResponseUtil.getSuccessResponse('Update Success', result);
                return response.status(200).send(successResponse);
            } else {
                const errorResponse = ResponseUtil.getErrorResponse('Update Failed', undefined);
                return response.status(400).send(errorResponse);
            }
            
        }        

    }

    @Put('/:userId/type')
    public async updateUserType(@Param('userId') userId: string,@Body({ validate: true }) body: UpdateUserTypeRequest,@Req() request: any, @Res() response: any): Promise<any> {
    
        const owner = await this.userService.findOne(new ObjectID(body.user_id));
        const user = await this.userService.findOne(new ObjectID(userId));

            if (owner && user) {

                if (owner.typy !== 'superadmin') {
                    
                    const errorResponse = ResponseUtil.getErrorResponse('You are not allowed', undefined);
                    return response.status(400).send(errorResponse);

                }

                const result = await this.userService.update(
                    { '_id' : new ObjectID(userId) },
                    { $set: {   
                                'type': body.type
                            }
                    });
        
                if (result) {
                
                    const log: Log = new Log();
                    log.action = 'update';
                    log.collection = 'user';
                    log.document = new ObjectID(userId);
                    log.description = owner.firstname + ' เปลี่ยนตำแหน่งของ ' + user.firstname;
                    log.user_id = new ObjectID(userId);
                    
                    await this.logService.create(log);
                    const successResponse = ResponseUtil.getSuccessResponse('Update Success', result);
                    return response.status(200).send(successResponse);
                } else {
                    const errorResponse = ResponseUtil.getErrorResponse('Update Failed', undefined);
                    return response.status(400).send(errorResponse);
                }

            } else {

                const errorResponse = ResponseUtil.getErrorResponse('Invalid userId or user_id', undefined);
                return response.status(400).send(errorResponse);

            }
    
    }

    @Delete('/:userId')
    public async deleteUser(@Param('userId') userId: string,@Req() request: any, @Res() response: any): Promise<any> {
        if (userId !== undefined) {
            const deleteUser = await this.userService.update(
                { '_id' : new ObjectID(userId) },
                { $set: {   
                            'is_deleted': true
                        }
                });
            return response.status(200).send(deleteUser);
        } else {
            return response.status(400).send('userId is Incorrect');
        }
    }

    @Get('/test/test')
    public async userTest(@Req() request: any, @Res() response: any): Promise<any> {

        const file = 'contact.icon';
        const subType = file.substring(0, file.indexOf('.'));
        return response.status(200).send(subType);
        return response.status(200).send(await User.hashPassword('sigo4321'));

    }

    @Put('/test/test')
    public async updateDelete(@Req() request: any, @Res() response: any): Promise<any> {
        
        const updateArticle = await this.userService.updateMany(
            { 'is_deleted': true },
            { $set: {   
                        'is_deleted': false
                    }
            });
        
        return response.status(200).send(updateArticle);
    }

}