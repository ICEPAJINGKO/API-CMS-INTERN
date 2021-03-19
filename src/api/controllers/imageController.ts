import 'reflect-metadata';
import { JsonController, Res, Req, Get, Param } from 'routing-controllers';
import { ResponseUtil } from '../../utils/ResponseUtil';
import { UserService } from '../services/UserService';
import { ArticleService } from '../services/ArticleService';
import { ContactService } from '../services/ContactService';
import { ObjectID } from 'mongodb';

@JsonController('/image')
export class ImageController {

    constructor(
        private userService: UserService,
        private articleService: ArticleService,
        private contactService: ContactService) {
    }

    @Get('/:table/:id')
    public async convertImage(@Param('table') table: string,@Param('id') id: string,@Req() request: any, @Res() response: any): Promise<any> {        
        
        if (table === 'article') {
            const article = await this.articleService.findOne({_id: new ObjectID(id)});
            const image64 = article.cover_image;
            const mimeType = image64.substring(image64.indexOf(':') + 1, image64.indexOf(';'));
            const data = image64.substring(image64.indexOf(',') + 1);
            return response.status(200).set('Content-Type', mimeType).set('Cache-Control', 'public').send(Buffer.from(data, 'base64'));
        }

        if (table === 'user') {
            const user = await this.userService.findOne({_id: new ObjectID(id)});
            const image64 = user.image;
            const mimeType = image64.substring(image64.indexOf(':') + 1, image64.indexOf(';'));
            const data = image64.substring(image64.indexOf(',') + 1);
            return response.status(200).set('Content-Type', mimeType).set('Cache-Control', 'public').send(Buffer.from(data, 'base64'));
        }

        if (table === 'contact') {
            const contact = await this.contactService.findOne({_id: new ObjectID(id)});
            const image64 = contact.icon;
            const mimeType = image64.substring(image64.indexOf(':') + 1, image64.indexOf(';'));
            const data = image64.substring(image64.indexOf(',') + 1);
            return response.status(200).set('Content-Type', mimeType).set('Cache-Control', 'public').send(Buffer.from(data, 'base64'));
        }

        const errorResponse = ResponseUtil.getErrorResponse('table Failed', undefined);
        return response.status(400).send(errorResponse);
    }

}