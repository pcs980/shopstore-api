import express from 'express';
import userRoutes from './routes/users';
import systemRoutes from './routes/system';

const app = express();
app.use(express.json());

userRoutes(app);
systemRoutes(app);

export default app;
