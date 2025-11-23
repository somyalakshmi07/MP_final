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
    // Handle connection errors (auth-service not running)
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      res.status(503).json({ 
        error: 'Auth service unavailable. Please ensure auth-service is running and can connect to Cosmos DB.' 
      });
      return;
    }
    // Handle auth-service errors
    if (error.response?.data) {
      res.status(error.response.status || 500).json(error.response.data);
      return;
    }
    // Generic error
    res.status(500).json({ error: 'Service unavailable. Please check backend services and database connection.' });
  }
});

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const response = await axios.post(`${services.auth}/auth/login`, req.body);
    res.json(response.data);
  } catch (error: any) {
    // Handle connection errors (auth-service not running)
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      res.status(503).json({ 
        error: 'Auth service unavailable. Please ensure auth-service is running and can connect to Cosmos DB.' 
      });
      return;
    }
    // Handle auth-service errors
    if (error.response?.data) {
      res.status(error.response.status || 500).json(error.response.data);
      return;
    }
    // Generic error
    res.status(500).json({ error: 'Service unavailable. Please check backend services and database connection.' });
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

// Catalog routes - public access (no authentication required)
router.get('/products', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const query = new URLSearchParams(req.query as any).toString();
    const headers: any = {};
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    const response = await axios.get(`${services.catalog}/products?${query}`, { headers });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.get('/products/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const headers: any = {};
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    const response = await axios.get(`${services.catalog}/products/${req.params.id}`, { headers });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.get('/categories', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const headers: any = {};
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    const response = await axios.get(`${services.catalog}/categories`, { headers });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

// Cart routes - optional authentication (supports guest carts)
router.get('/cart', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const headers: any = {};
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    if (req.guestId || req.headers['x-guest-id']) {
      headers['x-guest-id'] = req.guestId || req.headers['x-guest-id'];
    }
    const response = await axios.get(`${services.cart}/cart`, { headers });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.post('/cart/add', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const headers: any = {};
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    if (req.guestId || req.headers['x-guest-id']) {
      headers['x-guest-id'] = req.guestId || req.headers['x-guest-id'];
    }
    const response = await axios.post(`${services.cart}/cart/add`, req.body, { headers });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.put('/cart/:productId', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const headers: any = {};
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    if (req.guestId || req.headers['x-guest-id']) {
      headers['x-guest-id'] = req.guestId || req.headers['x-guest-id'];
    }
    const response = await axios.put(`${services.cart}/cart/${req.params.productId}`, req.body, { headers });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.delete('/cart/:productId', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const headers: any = {};
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    if (req.guestId || req.headers['x-guest-id']) {
      headers['x-guest-id'] = req.guestId || req.headers['x-guest-id'];
    }
    const response = await axios.delete(`${services.cart}/cart/${req.params.productId}`, { headers });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.delete('/cart', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const headers: any = {};
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }
    if (req.guestId || req.headers['x-guest-id']) {
      headers['x-guest-id'] = req.guestId || req.headers['x-guest-id'];
    }
    const response = await axios.delete(`${services.cart}/cart`, { headers });
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

router.put('/admin/orders/:id', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  try {
    const response = await axios.put(`${services.order}/admin/orders/${req.params.id}`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

// Admin category routes
router.post('/admin/categories', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  try {
    const response = await axios.post(`${services.catalog}/admin/categories`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.put('/admin/categories/:id', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  try {
    const response = await axios.put(`${services.catalog}/admin/categories/${req.params.id}`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

router.delete('/admin/categories/:id', authenticate, async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  try {
    const response = await axios.delete(`${services.catalog}/admin/categories/${req.params.id}`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
});

export default router;
