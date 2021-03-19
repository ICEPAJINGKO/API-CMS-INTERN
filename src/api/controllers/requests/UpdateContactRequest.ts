import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class UpdateContactRequest {

    @IsNotEmpty({ message: 'lable is required' })
    public lable: string;

    // @IsNotEmpty({ message: 'icon is required' })
    public icon: string;

    @IsNotEmpty({ message: 'value is required' })
    public value: string;

    @IsNotEmpty({ message: 'url is required' })
    public url: string;

    @IsNotEmpty({ message: 'user_id is required' })
    public user_id: string;

}