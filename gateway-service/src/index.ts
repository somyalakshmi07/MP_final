import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import gatewayRoutes from './routes/gatewayRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', gatewayRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gateway-service' });
});

app.listen(PORT, () => {
  console.log(`🚀 Gateway service running on port ${PORT}`);
});
