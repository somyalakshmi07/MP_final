import { Router } from 'express';
import {
  getProducts,
  getProduct,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/productController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

// Public routes - no authentication required
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/categories', getCategories);

// Admin product routes
router.get('/admin/products', authenticate, requireAdmin, getProducts);
router.post('/admin/products', authenticate, requireAdmin, createProduct);
router.put('/admin/products/:id', authenticate, requireAdmin, updateProduct);
router.delete('/admin/products/:id', authenticate, requireAdmin, deleteProduct);

// Admin category routes
router.post('/admin/categories', authenticate, requireAdmin, createCategory);
router.put('/admin/categories/:id', authenticate, requireAdmin, updateCategory);
router.delete('/admin/categories/:id', authenticate, requireAdmin, deleteCategory);

export default router;
