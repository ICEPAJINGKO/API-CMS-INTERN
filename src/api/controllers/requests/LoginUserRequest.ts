import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class LoginUserRequest {

    @IsNotEmpty({ message: 'username is required' })
    public username: string;

    @IsNotEmpty({ message: 'password is required' })
    public password: string;

}
