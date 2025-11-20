import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/cart', authenticate, getCart);
router.post('/cart/add', authenticate, addToCart);
router.put('/cart/:productId', authenticate, updateCartItem);
router.delete('/cart/:productId', authenticate, removeFromCart);
router.delete('/cart', authenticate, clearCart);

export default router;
