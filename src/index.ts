import 'dotenv/config';
import * as db from './utils/postgresql';
import { logger } from './utils/logger';

const port = process.env.PORT;

import app from './app';

app.listen(port, async () => {
  logger.info(`Service ready and listening to port ${port}`);
  await db.isAlive();
});
