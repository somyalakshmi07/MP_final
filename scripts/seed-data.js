// Seed script to populate initial data
// Run with: node scripts/seed-data.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://somyalakshmi17_db_user:9ft7qNZWLA5IqWUd@cluster0.v1rzlcu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce-app';

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stock: Number,
  sku: String,
  slug: String,
  featured: Boolean,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Category = mongoose.model('Category', CategorySchema);
const Product = mongoose.model('Product', ProductSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
      appName: 'ecommerce-app',
      tls: true,
      tlsAllowInvalidCertificates: false,
      minPoolSize: 5,
      maxPoolSize: 20,
    });
    console.log('Connected to MongoDB Atlas (ecommerce database)');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        email: 'admin@example.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'admin',
      },
      { upsert: true, new: true }
    );
    console.log('Admin user created:', admin.email);

    // Create categories
    const electronics = await Category.findOneAndUpdate(
      { slug: 'electronics' },
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories',
      },
      { upsert: true, new: true }
    );

    const clothing = await Category.findOneAndUpdate(
      { slug: 'clothing' },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
      },
      { upsert: true, new: true }
    );

    const books = await Category.findOneAndUpdate(
      { slug: 'books' },
      {
        name: 'Books',
        slug: 'books',
        description: 'Books and literature',
      },
      { upsert: true, new: true }
    );

    console.log('Categories created');

    // Create sample products
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        category: electronics._id,
        stock: 50,
        sku: 'WH-001',
        slug: 'wireless-headphones',
        featured: true,
      },
      {
        name: 'Smart Watch',
        description: 'Feature-rich smartwatch with health tracking',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        category: electronics._id,
        stock: 30,
        sku: 'SW-001',
        slug: 'smart-watch',
        featured: true,
      },
      {
        name: 'Cotton T-Shirt',
        description: 'Comfortable cotton t-shirt in various colors',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        category: clothing._id,
        stock: 100,
        sku: 'TS-001',
        slug: 'cotton-t-shirt',
        featured: false,
      },
      {
        name: 'JavaScript: The Definitive Guide',
        description: 'Comprehensive guide to JavaScript programming',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
        category: books._id,
        stock: 25,
        sku: 'BK-001',
        slug: 'javascript-the-definitive-guide',
        featured: false,
      },
    ];

    for (const productData of products) {
      await Product.findOneAndUpdate(
        { sku: productData.sku },
        productData,
        { upsert: true, new: true }
      );
    }

    console.log('Products created');
    console.log('Seed data completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();

