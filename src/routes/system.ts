import { Application } from 'express';
import * as controller from '../controllers/system';

const systemRoutes = (app: Application) => {
  app.get('/metrics', controller.metrics);
};

export default systemRoutes;
