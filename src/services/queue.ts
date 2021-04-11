import Queue from 'bull';
import k from '../utils/constants';

import ConfirmEmail from '../jobs/ConfirmEmail';

const emailQueue = new Queue(ConfirmEmail.key, {
  redis: {
    host: k.REDIS.HOST,
    port: k.REDIS.PORT,
  }
});

export default emailQueue;
