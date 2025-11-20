import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

router.post('/orders', authenticate, createOrder);
router.get('/orders', authenticate, getOrders);
router.get('/orders/:id', authenticate, getOrder);
router.put('/orders/:id', authenticate, updateOrderStatus);

router.get('/admin/orders', authenticate, requireAdmin, getOrders);

export default router;
