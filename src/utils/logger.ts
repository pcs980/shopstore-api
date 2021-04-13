import winston, { format, transports } from 'winston';
import k from './constants';

export enum LOG_LEVELS {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

const logger: winston.Logger = winston.createLogger({
  level: k.SERVICE.LOG_LEVEL,
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

export default logger;
