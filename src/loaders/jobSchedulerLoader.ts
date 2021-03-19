/*
 * Absolute Management Solutions RESTFUL API
 * version 1.0
 * Copyright (c) 2020 Absolute Management Solutions
 * Author Absolute Management Solutions <admin@project_name.com>
 * Licensed under the MIT license.
 */

import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
// import { env } from '../env';
// import * as schedule from 'node-schedule';
// import * as http from 'http';

/* 
* This will set job schedule for Clear Temp File
*/
export const jobSchedulerLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    // Run Every Hour
    // Clear Temp File
    // schedule.scheduleJob('*/5 * * * *', () => {
    //     const clearTempOptions: any = {
    //         host: env.app.host,
    //         port: env.app.port,
    //         path: env.app.routePrefix + '/file/temp',
    //         method: 'DELETE'
    //     };

    //     http.request(clearTempOptions, (res) => {
    //         console.log(`CLEAR TEMP FILE STATUS: ${res.statusCode}`);
    //     }).on('error', (err) => {
    //         // Handle error
    //         console.log('err: ' + err);
    //     }).end();
    // });
};
