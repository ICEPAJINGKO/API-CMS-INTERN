import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateConfigRequest {

    @IsNotEmpty({ message: 'value is required' })
    public value: string;

    @IsNotEmpty({ message: 'user_id is required' })
    public user_id: string;

}