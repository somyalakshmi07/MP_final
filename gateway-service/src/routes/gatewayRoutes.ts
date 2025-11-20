import { Router, Request, Response } from 'express';
import axios from 'axios';
import { authenticate, optionalAuth, AuthRequest } from '../middlewares/auth';
import { services } from '../config/services';

const router = Router();

// Auth routes - no authentication required
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${services.auth}/auth/register`, req.body);
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${services.auth}/auth/login`, req.body);
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.get('/auth/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.get(`${services.auth}/auth/profile`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

// Catalog routes - require authentication
router.get('/products', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const query = new URLSearchParams(req.query as any).toString();
    const response = await axios.get(`${services.catalog}/products?${query}`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.get('/products/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.get(`${services.catalog}/products/${req.params.id}`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.get('/categories', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.get(`${services.catalog}/categories`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

// Cart routes - require authentication
router.get('/cart', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.get(`${services.cart}/cart`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.post('/cart/add', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.post(`${services.cart}/cart/add`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.put('/cart/:productId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.put(`${services.cart}/cart/${req.params.productId}`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.delete('/cart/:productId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.delete(`${services.cart}/cart/${req.params.productId}`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.delete('/cart', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.delete(`${services.cart}/cart`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

// Order routes - require authentication
router.post('/orders', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.post(`${services.order}/orders`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.get('/orders', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.get(`${services.order}/orders`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.get('/orders/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.get(`${services.order}/orders/${req.params.id}`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

// Payment routes - require authentication
router.post('/payments', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const response = await axios.post(`${services.payment}/payments`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

// Admin routes - require admin role
router.get('/admin/products', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  try {
    const response = await axios.get(`${services.catalog}/admin/products`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.post('/admin/products', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  try {
    const response = await axios.post(`${services.catalog}/admin/products`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.put('/admin/products/:id', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  try {
    const response = await axios.put(`${services.catalog}/admin/products/${req.params.id}`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.delete('/admin/products/:id', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  try {
    const response = await axios.delete(`${services.catalog}/admin/products/${req.params.id}`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.get('/admin/orders', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  try {
    const response = await axios.get(`${services.order}/admin/orders`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

export default router;
