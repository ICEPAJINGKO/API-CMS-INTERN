/*
 * Absolute Management Solutions RESTFUL API
 * version 1.0
 * Copyright (c) 2020 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@project_name.com>
 * Licensed under the MIT license.
 */

import { Column, Entity, BeforeInsert, BeforeUpdate, ObjectIdColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import moment = require('moment/moment');
import { IsNotEmpty, IsMongoId } from 'class-validator';

@Entity('emailTemplate')
export class EmailTemplate extends BaseModel {

    @ObjectIdColumn({ name: '_id' })
    @IsNotEmpty()
    @IsMongoId()
    public id: number;

    @Column({ name: 'shortname' })
    public title: string;

    @Column({ name: 'subject' })
    public subject: string;

    @Column({ name: 'message' })
    public content: string;

    @Column({ name: 'isActive' })
    public isActive: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updateDate = moment().toDate();
    }
}
