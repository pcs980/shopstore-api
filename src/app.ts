import express from 'express';
import cors from 'cors';
import systemRoutes from './routes/system';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import logger from './utils/logger';
import k from './utils/constants';

if (!k.MAIL.HOST || !k.MAIL.PORT) {
  logger.error(`Trying to start REST API with no SMTP host and/or port`);
  process.exit(-1);
}

const app = express();
app.use(express.json({ limit: '2MB' }));
app.use(cors());

userRoutes(app);
productRoutes(app);
systemRoutes(app);

app.use(express.static('public'));
app.use('/images', express.static(__dirname + '/images'));

export default app;
