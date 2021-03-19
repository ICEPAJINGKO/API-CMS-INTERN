import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class UpdateVideoRequest {

    @IsNotEmpty({ message: 'name is required' })
    public name: string;

    @IsNotEmpty({ message: 'url is required' })
    public url: string;

    @IsNotEmpty({ message: 'description is required' })
    public description: string;

    @IsNotEmpty({ message: 'description is required' })
    public user_id: string;

}