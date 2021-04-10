import express from 'express';
import cors from 'cors';
import userRoutes from './routes/users';
import systemRoutes from './routes/system';

const app = express();
app.use(express.json());
app.use(cors());

userRoutes(app);
systemRoutes(app);

export default app;
