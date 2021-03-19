import { Column, Entity, ObjectIdColumn} from 'typeorm';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ObjectID } from 'mongodb';

@Entity('log_view')
export class LogView {
  @ObjectIdColumn({ name: '_id' })
  @IsNotEmpty()
  @IsMongoId()
  public id: ObjectID;

  @Column({ name: 'article_id' })
  @IsNotEmpty()
  public article_id: string;

  @Column({ name: 'date' })
  @IsNotEmpty()
  public date: Date;

  @Column({ name: 'time' })
  @IsNotEmpty()
  public time: Date;

  @Column({ name: 'ip_address' })
  @IsNotEmpty()
  public ip_address: string;
}