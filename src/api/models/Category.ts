import { Column, Entity, ObjectIdColumn} from 'typeorm';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ObjectID } from 'mongodb';

@Entity('category')
export class Category {
  @ObjectIdColumn({ name: '_id' })
  @IsNotEmpty()
  @IsMongoId()
  public id: ObjectID;

  @Column({ name: 'name' })
  @IsNotEmpty()
  public name: string;

  @Column({ name: 'parent_category' })
  public parent_category: ObjectID;

  @Column({ name: 'description' })
  public description: string;

  @Column({ name: 'pin' })
  @IsNotEmpty()
  public pin: boolean;

  @Column({ name: 'pin_ordering' })
  @IsNotEmpty()
  public pin_ordering: number;
}