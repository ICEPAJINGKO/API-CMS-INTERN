import 'reflect-metadata';
import { JsonController, Res, Req, Get, Post, Body, QueryParam, Delete, Put, Param } from 'routing-controllers';
import { Contact } from '../models/Contact';
import { ContactService } from '../services/ContactService';
import { ResponseUtil } from '../../utils/ResponseUtil';
import { CreateContactRequest } from './requests/CreateContactRequest';
import { UpdateContactRequest } from './requests/UpdateContactRequest';
import { ObjectID } from 'mongodb';
import { LogService } from '../services/LogService';
import { Log } from '../models/Log';
import { UserService } from '../services/UserService';

@JsonController('/contact')
export class ContactController {
    constructor(
        private contactService: ContactService,
        private logService: LogService,
        private userService: UserService) {
    }
    
    @Get()
    public async contact(@Req() request: any, @Res() response: any): Promise<any> {
        const allContact = await this.contactService.findAll();
        const result = this.contactService.formatContact(allContact);
        return response.status(200).send(result);
    }

    @Post()
    public async createContact(@Body({ validate: true }) body: CreateContactRequest, @Res() response: any, @Req() req: any): Promise<any> {
        const contact: Contact = new Contact();
        contact.lable = body.lable;
        contact.icon = body.icon;
        contact.value = body.value;
        contact.url = body.url;
        const result = await this.contactService.create(contact);

        if (result) {
            const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});

            const log: Log = new Log();
            log.action = 'create';
            log.collection = 'contact';
            log.document = new ObjectID(result.id);
            log.description = owner.firstname + ' สร้างข้อมูลการติดต่อ ' + result.lable;
            log.user_id = new ObjectID(body.user_id);
            
            await this.logService.create(log);
            const successResponse = ResponseUtil.getSuccessResponse('Create Success', result);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('Create Failed', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    @Put('/:contactId')
    public async updateContact(@Param('contactId') contactId: string,@Body({ validate: true }) body: UpdateContactRequest,@Req() request: any, @Res() response: any): Promise<any> {
        if (contactId !== undefined && contactId !== null && contactId !== '') {
            const result = await this.contactService.update(
                    { '_id' : new ObjectID(contactId) },
                    { $set: {   
                                'lable': body.lable,
                                'value': body.value,
                                'url': body.url 
                            }
                    });
            if (result) {
                if (body.icon !== undefined && body.icon !== null && body.icon !== '') {
                    await this.contactService.update(
                        { '_id' : new ObjectID(contactId) },
                        { $set: {   
                                    'icon': body.icon
                                }
                        });
                }

                const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});
                
                const log: Log = new Log();
                log.action = 'update';
                log.collection = 'contact';
                log.document = new ObjectID(result.id);
                log.description = owner.firstname + ' แก้ไขข้อมูลการติดต่อ ' + result.lable;
                log.user_id = new ObjectID(body.user_id);
                
                await this.logService.create(log);
                const successResponse = ResponseUtil.getSuccessResponse('Update Success', result);
                return response.status(200).send(successResponse);
            } else {
                const errorResponse = ResponseUtil.getErrorResponse('Update Failed', undefined);
                return response.status(400).send(errorResponse);
            }
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('contactId Failed', undefined);
            return response.status(400).send(errorResponse);
        }
    }

    @Delete('/:contactId')
    public async deleteContact(@Param('contactId') contactId: string,@QueryParam('user_id') user_id: string,@Req() request: any, @Res() response: any): Promise<any> {
        
        if (user_id === undefined || user_id == null || user_id === '') {
            const errorResponse = ResponseUtil.getErrorResponse('user_id Failed', undefined);
            return response.status(400).send(errorResponse);
        }

        const result = await this.contactService.deleteOne({_id : new ObjectID(contactId)});
        if (result) {
            const owner = await this.userService.findOne({_id : new ObjectID(user_id)});

            const log: Log = new Log();
            log.action = 'delete';
            log.collection = 'contact';
            log.document = new ObjectID(result.id);
            log.description = owner.firstname + ' ลบข้อมูลการติดต่อ ' + result.lable;
            log.user_id = new ObjectID(user_id);
                
            await this.logService.create(log);
            const successResponse = ResponseUtil.getSuccessResponse('Delete Success', result);
            return response.status(200).send(successResponse);
        } else {
            const errorResponse = ResponseUtil.getErrorResponse('Delete Failed', undefined);
            return response.status(400).send(errorResponse);
        }
        
    }
}