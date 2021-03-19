import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class UpdateArticlePinRequest {

    @IsNotEmpty({ message: 'id is required' })
    public id: string;

    @IsNotEmpty({ message: 'pin is required' })
    public pin: boolean;

    @IsNotEmpty({ message: 'pin_ordering is required' })
    public pin_ordering: number;

    @IsNotEmpty({ message: 'user_id is required' })
    public user_id: string;

}