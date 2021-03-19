import { Column, Entity, ObjectIdColumn} from 'typeorm';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ObjectID } from 'mongodb';

@Entity('log')
export class Log {
  @ObjectIdColumn({ name: '_id' })
  @IsNotEmpty()
  @IsMongoId()
  public id: ObjectID;

  @Column({ name: 'action' })
  @IsNotEmpty()
  public action: string;

  @Column({ name: 'collection' })
  @IsNotEmpty()
  public collection: string;

  @Column({ name: 'document' })
  @IsNotEmpty()
  public document: string;

  @Column({ name: 'description' })
  @IsNotEmpty()
  public description: string;

  @Column({ name: 'date' })
  @IsNotEmpty()
  public date: Date;

  @Column({ name: 'time' })
  @IsNotEmpty()
  public time: Date;

  @Column({ name: 'user_id' })
  @IsNotEmpty()
  public user_id: ObjectID;
}