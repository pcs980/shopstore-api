import { sendEmail } from '../services/email';
import { logger } from '../utils/logger';
import k from '../utils/constants';
import { JobProps } from '.';

const ConfirmEmail: JobProps = {
  key: 'ConfirmEmail',
  priority: k.REDIS.PRIORITY_HIGH,
  async handle(job: any) {
    const { data } = job;
    logger.debug(`ConfirmEmail job: ${JSON.stringify(data)}`);

    await sendEmail({
      code: data.verification_code,
      email: data.email,
      name: data.name,
      subject: 'Confirm your e-mail'
    });
  },
};

export default ConfirmEmail;
