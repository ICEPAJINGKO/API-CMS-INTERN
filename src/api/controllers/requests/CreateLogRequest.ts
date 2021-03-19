import 'reflect-metadata';
import { IsNotEmpty } from 'class-validator';

export class CreateLogRequest {

    @IsNotEmpty({ message: 'action is required' })
    public action: string;
  
    @IsNotEmpty({ message: 'collection is required' })
    public collection: string;
  
    @IsNotEmpty({ message: 'document is required' })
    public document: string;
  
    @IsNotEmpty({ message: 'description is required' })
    public description: string;
  
    @IsNotEmpty({ message: 'date is required' })
    public date: string; // Long type
  
    @IsNotEmpty({ message: 'time is required' })
    public time: string; // Long type
  
    @IsNotEmpty({ message: 'user_id is required' })
    public user_id: string;

}