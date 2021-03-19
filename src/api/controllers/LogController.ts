import 'reflect-metadata';
import { JsonController, Res, Req, Get } from 'routing-controllers';
import { LogService } from '../services/LogService';
// import { ObjectID } from 'mongodb';

@JsonController('/log')
export class LogController {
    constructor(
        private logService: LogService) {
    }

    @Get()
    public async findLog(@Req() request: any, @Res() response: any): Promise<any> {
        const allLog = await this.logService.aggregate(
            [
                {
                    $sort : { date : -1 }
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
        const result = await this.logService.formatLogField(allLog);
        return response.status(200).send(result);
    }

    @Get('/test/test')
    public async testtestLog(@Req() request: any, @Res() response: any): Promise<any> {
        const result = await this.logService.deleteMany({action: 'create'});
        return response.status(200).send(result);
    }

}