import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryRequest {

    @IsNotEmpty({ message: 'name is required' })
    public name: string;

    // @IsNotEmpty({ message: 'parent_category is required' })
    public parent_category: string;

    @IsNotEmpty({ message: 'description is required' })
    public description: string;

    @IsNotEmpty({ message: 'user_id is required' })
    public user_id: string;
    
}
