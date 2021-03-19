/*
 * LoginAPI API
 * version 1.0
 * Copyright (c) 2019 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@absolute.co.th>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import {IsNotEmpty, IsEmail} from 'class-validator';

export class UserLogin {

    @IsEmail()
    @IsNotEmpty()
    public username: string;

    @IsNotEmpty({
        message: 'Password is required',
    })
    public password: string;

}
