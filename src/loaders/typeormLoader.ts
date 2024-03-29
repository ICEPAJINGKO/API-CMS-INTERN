/*
 * Absolute Management Solutions RESTFUL API
 * version 1.0
 * Copyright (c) 2020 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@project_name.com>
 * Licensed under the MIT license.
 */

import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createConnection, getConnectionOptions, ConnectionManager, getConnectionManager, Connection } from 'typeorm';
import { env } from '../env';
import { Logger } from '../lib/logger';

export const typeormLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    const log = new Logger(__filename);
    const loadedConnectionOptions = await getConnectionOptions();

    let connection: Connection;
    const connectionManager: ConnectionManager = getConnectionManager();

    if (connectionManager.has('this')) {
        connection = await connectionManager.get('this');
    } else {
        const connectionOptions = Object.assign(loadedConnectionOptions, {
            type: env.db.type as any,
            host: env.db.host,
            port: env.db.port,
            database: env.db.database,
            url: env.db.url,
            ssl: false,
            synchronize: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            entitySchemas: [env.app.dirs.entities]
        });

        connection = await createConnection(connectionOptions);
    }

    if (connection.isConnected) {
        log.debug('Connection Success');
    } else {
        log.error('Connection Error');
        connection = await connection.connect();
    }

    if (settings) {
        settings.setData('connection', connection);
        settings.onShutdown(() => connection.close());
    }
};
