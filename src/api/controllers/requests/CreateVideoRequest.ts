import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateVideoRequest {

    @IsNotEmpty({ message: 'name is required' })
    public name: string;

    @IsNotEmpty({ message: 'url is required' })
    public url: string;

    @IsNotEmpty({ message: 'description is required' })
    public description: string;

    @IsNotEmpty({ message: 'user_id is required' })
    public user_id: string;

}