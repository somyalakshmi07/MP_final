import { Router } from 'express';
import { processPayment } from '../controllers/paymentController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/payments', authenticate, processPayment);

export default router;
