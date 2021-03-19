import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateArticleRequest {

    @IsNotEmpty({ message: 'title is required' })
    public title: string;

    @IsNotEmpty({ message: 'category_id is required' })
    public category_id: string;

    @IsNotEmpty({ message: 'content is required' })
    public content: string;

    @IsNotEmpty({ message: 'pre_content is required' })
    public pre_content: string;

    @IsNotEmpty({ message: 'cover_image is required' })
    public cover_image: string;

    @IsNotEmpty({ message: 'tag_id is required' })
    public tag_id: string[];

    @IsNotEmpty({ message: 'url_video is required' })
    public url_video: string;

    @IsNotEmpty({ message: 'status is required' })
    public status: string;

    @IsNotEmpty({ message: 'user_id is required' })
    public user_id: string;

    @IsNotEmpty({ message: 'publish_datetime is required' })
    public publish_datetime: string;

}