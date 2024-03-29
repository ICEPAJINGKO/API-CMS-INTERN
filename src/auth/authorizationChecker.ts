/*
 * Absolute Management Solutions RESTFUL API
 * version 1.0
 * Copyright (c) 2020 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@project_name.com>
 * Licensed under the MIT license.
 */

import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import { Connection } from 'typeorm';
import { Logger } from '../lib/logger';
import { AuthService } from './AuthService';

export function authorizationChecker(connection: Connection): (action: Action, roles: string[]) => Promise<boolean> | boolean {
    const log = new Logger(__filename);
    const authService = Container.get<AuthService>(AuthService);

    return async function innerAuthorizationChecker(action: Action, roles: any): Promise<boolean> {
        // here you can use request/response objects from action
        // also if decorator defines roles it needs to access the action
        // you can use them to provide granular access check
        // checker must return either boolean (true or false)
        // either promise that resolves a boolean value
        const userId = await authService.parseBasicAuthFromRequest(action.request);

        if (userId === null && userId === undefined) {
            log.warn('No credentials given');
            return false;
        }

        log.debug('roles >>> ', roles);

        if (roles[0] === 'user') {
            console.log('userId check: ' + userId);
            action.request.user = await authService.validateUser(userId);

            if (action.request.user === undefined) {
                log.warn('Invalid credentials given');
                return false;
            } else {
                log.info('Successfully checked credentials');
                return true;
            }
        } else {
            console.log('validate admin');
            action.request.user = await authService.validateAdmin(userId);
            if (action.request.user === undefined) {
                log.warn('Invalid credentials given');
                return false;
            } else {
                log.info('Successfully checked credentials');
                return true;
            }
        }
    };
}
