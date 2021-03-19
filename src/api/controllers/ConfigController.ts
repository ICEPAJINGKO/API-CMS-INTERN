import 'reflect-metadata';
import { JsonController, Res, Req, Get, Post, Body, QueryParam, Delete, Param, Put } from 'routing-controllers';
// import { Config } from '../models/Config';
import { ConfigService } from '../services/ConfigService';
import { ResponseUtil } from '../../utils/ResponseUtil';
import { CreateConfigRequest } from './requests/CreateConfigRequest';
import { ObjectID } from 'mongodb';
import { LogService } from '../services/LogService';
import { Log } from '../models/Log';
import { UserService } from '../services/UserService';

@JsonController('/config')
export class ConfigController {
    constructor(
        private configService: ConfigService,
        private logService: LogService,
        private userService: UserService) {
    }
    
    @Get('/:configName')
    public async config(@Param('configName') configName: string,@Req() request: any, @Res() response: any): Promise<any> {
        if (configName !== undefined && configName !== null) {
            const result = await this.configService.findOne({name: configName});
            return response.status(200).send(result);
        } else {
            const result = await this.configService.findAll();
            return response.status(200).send(result);
        }
    }

    @Put('/:configName')
    public async createConfig(@Param('configName') configName: string,@Body({ validate: true }) body: CreateConfigRequest,@QueryParam('name') name2: string, @Res() response: any, @Req() req: any): Promise<any> {
        const result = await this.configService.update(
            { 'name' : configName },
            { $set: {   
                        'value': body.value,
                    }
            });
            if (result) {
                const owner = await this.userService.findOne({_id : new ObjectID(body.user_id)});
    
                const log: Log = new Log();
                log.action = 'update';
                log.collection = 'article';
                log.document = configName;
                log.description = owner.firstname + ' แก้ไข ' + configName;
                log.user_id = new ObjectID(body.user_id);
                
                await this.logService.create(log);
                const successResponse = ResponseUtil.getSuccessResponse('Register Success', result);
                return response.status(200).send(successResponse);
            } else {
                const errorResponse = ResponseUtil.getErrorResponse('Register Failed', undefined);
                return response.status(400).send(errorResponse);
            }
    }

    @Delete()
    public async deleteConfig(@Req() request: any, @Res() response: any): Promise<any> {
        return false;
    }
}