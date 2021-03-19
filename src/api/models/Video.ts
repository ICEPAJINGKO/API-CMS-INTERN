import { Column, Entity, ObjectIdColumn} from 'typeorm';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ObjectID } from 'mongodb';

@Entity('video')
export class Video {

    @ObjectIdColumn({ name: '_id' })
    @IsNotEmpty()
    @IsMongoId()
    public id: ObjectID;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'url' })
    public url: string;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'ordering' })
    public ordering: number;

    @Column({ name: 'active' })
    public active: boolean;
    
}