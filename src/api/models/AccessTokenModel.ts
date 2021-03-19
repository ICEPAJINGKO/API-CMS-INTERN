/*
 * LoginAPI API
 * version 1.0
 * Copyright (c) 2019 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@absolute.co.th>
 * Licensed under the MIT license.
 */
import {BeforeInsert, BeforeUpdate, Column, Entity} from 'typeorm';
import {PrimaryGeneratedColumn} from 'typeorm/index';
import {User} from './User';
import {JoinColumn} from 'typeorm/index';
import {ManyToOne} from 'typeorm/index';
import {BaseModel} from './BaseModel';
import moment = require('moment');
@Entity('access_token')

export class AccessToken extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'token' })
    public token: string;

    @ManyToOne(type => User, user => user.accessToken)
    @JoinColumn({ name: 'user_id' })
    public user: User;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().toDate();
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updateDate = moment().toDate();
    }

}
