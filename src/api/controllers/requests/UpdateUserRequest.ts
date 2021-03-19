import 'reflect-metadata';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateUserRequest {

    @IsNotEmpty({ message: 'username is required' })
    public username: string;

    // @IsNotEmpty({ message: 'password is required' })
    // public password: string;

    @IsNotEmpty({ message: 'firstname is required' })
    public firstname: string;

    @IsNotEmpty({ message: 'lastname is required' })
    public lastname: string;

    @IsEmail()
    @IsNotEmpty({ message: 'email is required' })
    public email: string;

    // @IsNotEmpty({ message: 'image is required' })
    public image: string;

    @IsNotEmpty({ message: 'nickname is required' })
    public nickname: string;

    @IsNotEmpty({ message: 'user_id is required' })
    public user_id: string;

}