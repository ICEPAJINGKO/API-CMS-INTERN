import 'reflect-metadata';
import { JsonController, Res, Req, Get } from 'routing-controllers';
import { LogViewService } from '../services/LogViewService';

@JsonController('/logview')
export class LogViewController {
    constructor(
        private logViewService: LogViewService) {
    }

    @Get()
    public async findLogView(@Req() request: any, @Res() response: any): Promise<any> {
        const allLogView = await this.logViewService.findAll();
            return response.status(200).send(allLogView);
    }
}