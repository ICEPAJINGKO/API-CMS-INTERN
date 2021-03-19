import { Column, Entity, ObjectIdColumn} from 'typeorm';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ObjectID } from 'mongodb';

@Entity('tag')
export class Tag {
  @ObjectIdColumn({ name: '_id' })
  @IsNotEmpty()
  @IsMongoId()
  public id: ObjectID;

  @Column({ name: 'name' })
  public name: string;
}