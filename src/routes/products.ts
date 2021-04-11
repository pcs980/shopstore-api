import { Application } from 'express';
import * as controller from '../controllers/products';
import auth from '../middlewares/authorization';

const productRoutes = (app: Application) => {
  app.get('/products', auth, controller.get);
  app.post('/products', auth, controller.create);
  app.put('/products/:id', auth, controller.update);
};

export default productRoutes;
