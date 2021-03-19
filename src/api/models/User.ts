import { Column, Entity, ObjectIdColumn} from 'typeorm';
import { IsNotEmpty, IsMongoId, IsEmail } from 'class-validator';
import { ObjectID } from 'mongodb';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class User {

    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    public static comparePassword(user: User, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                resolve(res === true);
            });
        });
    }

    @ObjectIdColumn({ name: '_id' })
    @IsNotEmpty()
    @IsMongoId()
    public id: ObjectID;

    @Column({ name: 'username' })
    public username: string;

    @Column({ name: 'password' })
    public password: string;

    @Column({ name: 'firstname' })
    public firstname: string;

    @Column({ name: 'lastname' })
    public lastname: string;

    @IsEmail()
    @Column({ name: 'email' })
    public email: string;

    @Column({ name: 'type' })
    public type: string;

    @Column({ name: 'image' })
    public image: string;

    @Column({ name: 'nickname' })
    public nickname: string;

    @Column({ name: 'is_deleted' })
    public is_deleted: boolean;

}