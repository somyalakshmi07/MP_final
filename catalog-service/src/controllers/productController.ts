import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { createProductSchema, updateProductSchema } from '../schemas/productSchemas';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '12',
      category,
      search,
      minPrice,
      maxPrice,
      sort = 'createdAt',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) {
        query.category = cat._id;
      }
    }

    if (search) {
      query.$text = { $search: search as string };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice as string);
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortObj: any = {};
    sortObj[sort as string] = sortOrder;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.id })
      .populate('category', 'name slug')
      .lean();

    if (!product) {
      const productById = await Product.findById(req.params.id)
        .populate('category', 'name slug')
        .lean();
      if (!productById) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json(productById);
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = createProductSchema.safeParse(req.body);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      res.status(400).json({ errors });
      return;
    }

    const data = validation.data;
    const category = await Category.findById(data.category);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = new Product({
      ...data,
      slug,
    });

    await product.save();
    await product.populate('category', 'name slug');

    res.status(201).json(product);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Product with this SKU or slug already exists' });
      return;
    }
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = updateProductSchema.safeParse(req.body);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      res.status(400).json({ errors });
      return;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const data = validation.data;
    if (data.name) {
      product.name = data.name;
      product.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (data.description) product.description = data.description;
    if (data.price !== undefined) product.price = data.price;
    if (data.image) product.image = data.image;
    if (data.category) {
      const category = await Category.findById(data.category);
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      product.category = category._id;
    }
    if (data.stock !== undefined) product.stock = data.stock;
    if (data.sku) product.sku = data.sku;
    if (data.featured !== undefined) product.featured = data.featured;

    await product.save();
    await product.populate('category', 'name slug');

    res.json(product);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Product with this SKU or slug already exists' });
      return;
    }
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Category admin operations
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim() === '') {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check if category with same name or slug exists
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      res.status(400).json({ error: 'Category with this name already exists' });
      return;
    }

    const category = new Category({
      name: name.trim(),
      slug,
      description: description?.trim(),
    });

    await category.save();
    res.status(201).json(category);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Category with this slug already exists' });
      return;
    }
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    if (name && name.trim() !== '') {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      // Check if another category with same name or slug exists
      const existing = await Category.findOne({ 
        $or: [{ name }, { slug }],
        _id: { $ne: categoryId }
      });
      if (existing) {
        res.status(400).json({ error: 'Category with this name already exists' });
        return;
      }

      category.name = name.trim();
      category.slug = slug;
    }

    if (description !== undefined) {
      category.description = description?.trim();
    }

    await category.save();
    res.json(category);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Category with this slug already exists' });
      return;
    }
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = req.params.id;

    // Check if any products use this category
    const productsCount = await Product.countDocuments({ category: categoryId });
    if (productsCount > 0) {
      res.status(400).json({ 
        error: `Cannot delete category. ${productsCount} product(s) are using this category.` 
      });
      return;
    }

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};