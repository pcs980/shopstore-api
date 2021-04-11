export default {
  STATUS_OK: 200,
  STATUS_CREATED: 201,
  STATUS_UNAUTHORIZED: 401,
  STATUS_NOT_FOUND: 404,
  STATUS_INVALID_REQUEST: 412,
  STATUS_INTERNAL_ERROR: 500,
  DATABASE_ERROR: 'DatabaseError',
  INTERNAL_ERROR: 'InternalError',
  REQUEST_ERROR: 'RequestError',
  SERVICE: {
    ROLE: process.env.SERVICE_ROLE || 'ALL',
    PORT: process.env.PORT || 3030,
    LOG_LEVEL: process.env.LOG_LEVEL || 'error',
    JWT_SK: process.env.JWT_SK || 'Sup3r5Ecr37k3y',
  },
  DATABASE: {
    NAME: process.env.DB_NAME,
    URL: process.env.DB_URL,
    PORT: Number(process.env.DB_PORT),
    USER: process.env.DB_USER,
    PW: process.env.DB_PW,
  },
  MAIL: {
    HOST: process.env.MAIL_HOST,
    PORT: process.env.MAIL_PORT,
    USER: process.env.MAIL_USER,
    PW: process.env.MAIL_PW,
  },
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PORT: Number(process.env.REDIS_PORT),
    PRIORITY_HIGH: 1,
    PRIORITY_LOW: 10,
  }
};
