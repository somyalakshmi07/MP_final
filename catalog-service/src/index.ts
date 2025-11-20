import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());

app.use('/', productRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'catalog-service' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Catalog service running on port ${PORT}`);
  });
});
