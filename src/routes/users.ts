import { Application } from 'express';
import * as controller from '../controllers/users';

const userRoutes = (app: Application) => {
  app.post('/users/confirm', controller.confirmCode);
  app.post('/signup', controller.signup);
  app.post('/signin', controller.signin);
};

export default userRoutes;
