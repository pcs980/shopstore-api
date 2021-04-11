import { Application } from 'express';
import * as controller from '../controllers/products';

const productRoutes = (app: Application) => {
  app.get('/products', controller.get);
  app.post('/products', controller.create);
};

export default productRoutes;
