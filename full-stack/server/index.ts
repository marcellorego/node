import * as dotenv from 'dotenv';
import { Server } from './server';
import { factory } from './logging';

const log = factory.getLogger('Index');

dotenv.load({ path: '.env' });
log.info(`APP_NAME ${process.env.APP_NAME}`);
log.info(`PORT ${process.env.PORT}`);

log.info(`Running server...`);
new Server().run();
