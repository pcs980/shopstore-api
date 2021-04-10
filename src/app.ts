import express from 'express';
import userRoutes from './routes/users';

const app = express();
app.use(express.json());

userRoutes(app);

export default app;
