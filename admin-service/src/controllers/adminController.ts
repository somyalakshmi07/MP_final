import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import axios from 'axios';

const CATALOG_SERVICE = process.env.CATALOG_SERVICE_URL || 'http://catalog-service:3002';
const ORDER_SERVICE = process.env.ORDER_SERVICE_URL || 'http://order-service:3004';

// Product management
export const getProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${CATALOG_SERVICE}/api/products`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const response = await axios.post(`${CATALOG_SERVICE}/api/admin/products`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const response = await axios.put(
      `${CATALOG_SERVICE}/api/admin/products/${req.params.id}`,
      req.body,
      {
        headers: { Authorization: req.headers.authorization },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const response = await axios.delete(
      `${CATALOG_SERVICE}/api/admin/products/${req.params.id}`,
      {
        headers: { Authorization: req.headers.authorization },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
};

// Category management
export const getCategories = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${CATALOG_SERVICE}/api/categories`);
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
};

export const createCategory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const response = await axios.post(`${CATALOG_SERVICE}/api/admin/categories`, req.body, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
};

// Order management
export const getOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${ORDER_SERVICE}/api/orders`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
};

export const updateOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const response = await axios.put(
      `${ORDER_SERVICE}/api/orders/${req.params.id}`,
      req.body,
      {
        headers: { Authorization: req.headers.authorization },
      }
    );
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Service unavailable' });
  }
};

