import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "da0fabe8888d9c",
    pass: "ae8342b6521953"
  }
});

interface SendEmailRequest {
  subject: string;
  email: string;
  name: string;
  code: string;
}

const sendEmail = async (request: SendEmailRequest) => {
  const result = await transport.sendMail({
    from: 'Shopstore <no-reply@shopstore.com>',
    to: request.email,
    subject: request.subject,
    text: `
Hi, ${request.name}!


We're glad to welcome you to our team.

Your account is almost ready. Here is your confirmation code.

***  ${request.code}  ***

Please, copy it, signin to our site and paste it to 'Confirmation code' field.



Best regards,
Shopstore Team
    `
  });

  logger.debug(`Email result: ${JSON.stringify(result)}`);
};

export {
  sendEmail,
};
