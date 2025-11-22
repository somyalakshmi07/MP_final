import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController';
import { optionalAuth } from '../middlewares/auth';

const router = Router();

router.get('/cart', optionalAuth, getCart);
router.post('/cart/add', optionalAuth, addToCart);
router.put('/cart/:productId', optionalAuth, updateCartItem);
router.delete('/cart/:productId', optionalAuth, removeFromCart);
router.delete('/cart', optionalAuth, clearCart);

export default router;
