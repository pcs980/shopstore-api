import { sendEmail } from '../services/email';
import { logger } from '../utils/logger';

export default {
  key: 'ConfirmEmail',
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
}