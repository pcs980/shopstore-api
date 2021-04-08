import {
  Sequelize
} from 'sequelize';
import { logger } from './logger';

const database = process.env.DB_NAME || '';
const host = process.env.DB_URL || '';
const port = Number(process.env.DB_PORT || 0);
const username = process.env.DB_USER || '';
const password = process.env.DB_PW || '';

const sequelize = new Sequelize({
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  host,
  port,
  database,
  username,
  password,
  logging: false,
  hooks: {
    afterConnect() {
      logger.info('Database connected');
    },
    afterDisconnect() {
      logger.info('Database disconnected');
    },
    afterDestroy() {
      logger.info('Instance destroyed');
    },
    beforeConnect() {
      logger.info('Trying to connect to database');
    },
  }
});

const isAlive = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    logger.error(`Failed to connect: ${error}`)
    return false;
  }
};

const close = () => {
  sequelize.close()
    .then(() => logger.info('Database closed'))
    .catch((error) => logger.error(`Can't close database: ${error}`));
}

export default sequelize;

export {
  close,
  isAlive,
};
