import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserPasswordRequest {

    // @IsNotEmpty({ message: 'oldpassword is required' })
    public oldpassword: string;

    @IsNotEmpty({ message: 'newpassword is required' })
    public newpassword: string;

    @IsNotEmpty({ message: 'user_id is required' })
    public user_id: string;

}