import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class UpdateTagRequest {

    @IsNotEmpty({ message: 'name is required' })
    public name: string;

    @IsNotEmpty({ message: 'user_id is required' })
    public user_id: string;

}