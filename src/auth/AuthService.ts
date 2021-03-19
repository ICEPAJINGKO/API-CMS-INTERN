/*
 * Absolute Management Solutions RESTFUL API
 * version 1.0
 * Copyright (c) 2020 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@project_name.com>
 * Licensed under the MIT license.
 */

import * as express from 'express';
import jwt from 'jsonwebtoken';
import { ObjectID } from 'mongodb';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { env } from '../env';
import { User } from '../api/models/User';
import { UserRepository } from '../api/repositories/UserRepository';

@Service()
export class AuthService {

    constructor(@OrmRepository() private userRepository: UserRepository) { }

    public async parseBasicAuthFromRequest(req: express.Request): Promise<any> {
        const authorization = req.header('authorization');
        // const mode = req.header('mode');

        console.log('authorization >>>> ', authorization);

        if (authorization !== null && authorization !== undefined) {
            const prefix = authorization.split(' ')[0];

            if (prefix === 'Bearer') {
                if (!authorization) {
                    return undefined;
                }

                const token = authorization.split(' ')[1];

                const UserId = await this.decryptToken(token);

                return UserId;
            }

            return undefined;
        }
    }

    public async decryptToken(encryptString: string): Promise<number> {
        return new Promise<number>((subresolve, subreject) => {
            jwt.verify(encryptString, env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    return subresolve(undefined);
                }
                return subresolve(decoded.id);
            });
        });
    }

    public async validateUser(userId: any): Promise<User> {
        const uid = new ObjectID(userId);

        const user = await this.userRepository.findOne({ where: { _id: uid } });

        console.log(user);

        if (user) {
            return user;
        }

        return undefined;
    }

    public async validateAdmin(userId: any): Promise<any> {
        const uid = new ObjectID(userId);
        const customer = await this.userRepository.findOne({ where: { _id: uid, isAdmin: true } });

        console.log(customer);

        if (customer) {
            return customer;
        }

        return undefined;
    }
}
