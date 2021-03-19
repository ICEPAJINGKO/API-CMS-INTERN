import { Column, Entity, ObjectIdColumn} from 'typeorm';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ObjectID } from 'mongodb';

@Entity('contact')
export class Contact {
  @ObjectIdColumn({ name: '_id' })
  @IsNotEmpty()
  @IsMongoId()
  public id: ObjectID;

  @Column({ name: 'lable' })
  public lable: string;

  @Column({ name: 'icon' })
  public icon: string;

  @Column({ name: 'value' })
  public value: string;

  @Column({ name: 'url' })
  public url: string;
}