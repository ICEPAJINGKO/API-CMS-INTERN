/*
 * Absolute Management Solutions RESTFUL API
 * version 2.0.0
 * http://api.LoginAPI.com
 *
 * Copyright (c) 2020 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@project_name.com>
 * Licensed under the MIT license.
 */

import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '../../api/models/User';
define(User, (faker: typeof Faker, settings: { role: string []}) => {
    const user = new User();
    user.username = 'tester2@project_name.com';
    user.email = 'tester2@project_name.com';
    // user.isAdmin = false;
    return user;
});
