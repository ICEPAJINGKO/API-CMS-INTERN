/*
 * Absolute Management Solutions RESTFUL API
 * version 1.0
 * Copyright (c) 2020 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@project_name.com>
 * Licensed under the MIT license.
 */

import { Column } from 'typeorm';
import { ObjectID } from 'mongodb';
import { Exclude } from 'class-transformer';

export abstract class BaseModel {

    @Exclude()
    @Column({ name: 'createdBy' })
    public createdBy: ObjectID;

    @Column({ name: 'createdDate' })
    public createdDate: Date;

    @Column({ name: 'createdTime' })
    public createdTime: Date;

    @Column({ name: 'createdByUsername' })
    public createdByUsername: string;

    @Exclude()
    @Column({ name: 'updateDate' })
    public updateDate: Date;

    @Column({ name: 'updateByUsername' })
    public updateByUsername: string;
}
