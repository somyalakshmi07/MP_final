import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

// Public routes - no authentication required
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/categories', getCategories);

router.get('/admin/products', authenticate, requireAdmin, getProducts);
router.post('/admin/products', authenticate, requireAdmin, createProduct);
router.put('/admin/products/:id', authenticate, requireAdmin, updateProduct);
router.delete('/admin/products/:id', authenticate, requireAdmin, deleteProduct);

export default router;
