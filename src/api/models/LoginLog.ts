/*
 * LoginAPI API
 * version 1.0
 * Copyright (c) 2019 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@absolute.co.th>
 * Licensed under the MIT license.
 */

import { IsNotEmpty, IsEmail, IsMongoId } from 'class-validator';
import {
    BeforeInsert, Column, Entity, BeforeUpdate, ObjectIdColumn
} from 'typeorm';

import {BaseModel} from './BaseModel';
import moment from 'moment';

@Entity('login_log')
export class LoginLog extends BaseModel {

    @ObjectIdColumn({ name: '_id' })
    @IsNotEmpty()
    @IsMongoId()
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'user_id' })
    public userId: number;

    @IsEmail()
    @Column({ name: 'email_id' })
    public emailId: string;

    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'ip_address' })
    public ipAddress: string;

    @BeforeInsert()
    public async hashPassword(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updateDate = moment().toDate();
    }
}
