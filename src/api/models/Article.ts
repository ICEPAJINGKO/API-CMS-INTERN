import { Column, Entity, ObjectIdColumn} from 'typeorm';
import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ObjectID } from 'mongodb';

@Entity('article')
export class Article {

    @ObjectIdColumn({ name: '_id' })
    @IsNotEmpty()
    @IsMongoId()
    public id: ObjectID;

    @Column({ name: 'title' })
    public title: string;

    @Column({ name: 'category_id' })
    public category_id: ObjectID;

    @Column({ name: 'content' })
    public content: string;

    @Column({ name: 'pre_content' })
    public pre_content: string;

    @Column({ name: 'cover_image' })
    public cover_image: string;

    @Column({ name: 'tag_id' })
    public tag_id: ObjectID[];

    @Column({ name: 'url_video' })
    public url_video: string;

    @Column({ name: 'status' })
    public status: string;

    @Column({ name: 'user_id' })
    public user_id: ObjectID;

    @Column({ name: 'create_date' })
    public create_date: Date;

    @Column({ name: 'create_time' })
    public create_time: Date;

    @Column({ name: 'update_date' })
    public update_date: Date;

    @Column({ name: 'update_time' })
    public update_time: Date;

    @Column({ name: 'publish_datetime' })
    public publish_datetime: Date;

    @Column({ name: 'viewer_count' })
    public viewer_count: number;

    @Column({ name: 'pin' })
    public pin: boolean;

    @Column({ name: 'pin_ordering' })
    public pin_ordering: number;

    @Column({ name: 'is_deleted' })
    public is_deleted: boolean;

}