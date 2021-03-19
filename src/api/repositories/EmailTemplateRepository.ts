/*
 * Absolute Management Solutions RESTFUL API
 * version 1.0
 * Copyright (c) 2020 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@project_name.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, MongoRepository } from 'typeorm';
import {EmailTemplate} from '../models/EmailTemplate';

@EntityRepository(EmailTemplate)
export class EmailTemplateRepository extends MongoRepository<EmailTemplate>  {

}
