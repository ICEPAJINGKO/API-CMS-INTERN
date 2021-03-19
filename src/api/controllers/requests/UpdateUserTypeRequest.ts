import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserTypeRequest {

    @IsNotEmpty({ message: 'type is required' })
    public type: string;

    @IsNotEmpty({ message: 'user_id is required' })
    public user_id: string;

}