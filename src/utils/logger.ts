import winston, { format, transports } from 'winston';

export enum LOG_LEVELS {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export const logger: winston.Logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: format.combine(
      format.colorize(),
      format.timestamp({
        format: 'DD-MM-YY HH:mm:ss',
      }),
      format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports:[
    new transports.Console()
  ]
});
