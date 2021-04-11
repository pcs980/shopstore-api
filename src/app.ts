import express from 'express';
import cors from 'cors';
import systemRoutes from './routes/system';
import userRoutes from './routes/users';
import productRoutes from './routes/products';

const app = express();
app.use(express.json());
app.use(cors());

userRoutes(app);
productRoutes(app);
systemRoutes(app);

export default app;
