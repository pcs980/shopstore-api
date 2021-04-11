import Queue from './services/queue';
import { logger } from './utils/logger';
import k from './utils/constants';

if (!k.REDIS.HOST || !k.REDIS.PORT) {
  logger.error(`Trying to start consume with no Redis host and/or port`);
  process.exit(-1);
}

export const startConsume = () => {
  logger.info(`Start consuming queues from ${k.REDIS.HOST}:${k.REDIS.PORT}`);
  Queue.process();
};
