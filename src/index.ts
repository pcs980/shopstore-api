import 'dotenv/config';
import app from './app';
import { startConsume } from './consumer';

import k from './utils/constants';
import * as db from './utils/postgresql';
import { logger } from './utils/logger';

if (k.SERVICE.ROLE === 'QUEUE' || k.SERVICE.ROLE === 'ALL') {
  startConsume();
}

if (k.SERVICE.ROLE === 'REST' || k.SERVICE.ROLE === 'ALL') {
  const port = k.SERVICE.PORT;

  app.listen(port, async () => {
    logger.info(`Service ready and listening to port ${port}`);
    await db.isAlive();
  });
}
