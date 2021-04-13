import Queue from 'bull';
import k from '../utils/constants';
import * as jobs from '../jobs';
import logger from '../utils/logger';
import { incrementJobFail } from '../utils/metrics';

const queues = Object.values(jobs).map((job) => {
  const queue = new Queue(job.key, {
    defaultJobOptions: {
      attempts: 3,
      priority: job.priority,
    },
    redis: {
      host: k.REDIS.HOST,
      port: k.REDIS.PORT,
    }
  });

  queue.on('error', (error) => {
    logger.error(`Queue error: ${JSON.stringify(error)}`);
    process.exit(-1);
  });

  queue.on('failed', (job) => {
    logger.error(`Job failed: ${job.queue.name}, reason: ${job.failedReason}, data: ${JSON.stringify(job.data)}`);
    incrementJobFail(job.queue.name);
  });

  return {
    bull: queue,
    name: job.key,
    handle: job.handle
  };
});

export default {
  queues,
  add(name: string, data: any) {
    const queue = this.queues.find((q) => q.name === name);
    return queue?.bull.add(data);
  },
  process() {
    return this.queues.forEach((q) => q.bull.process(q.handle));
  }
};
