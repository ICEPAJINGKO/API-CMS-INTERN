/*
 * LoginAPI API
 * version 1.0
 * Copyright (c) 2019 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@absolute.co.th>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import { AccessToken } from '../models/AccessTokenModel';

@EntityRepository(AccessToken)
export class AccessTokenRepository extends Repository<AccessToken>  {

}
