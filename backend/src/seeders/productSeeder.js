import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const seedProducts = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Fetch products from fakestoreapi
    const response = await axios.get('https://fakestoreapi.com/products');
    const products = response.data;

    // Transform and insert products
    const transformedProducts = products.map((product) => ({
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      rating: product.rating?.rate || 0,
      reviews: product.rating?.count || 0,
      stock: Math.floor(Math.random() * 100) + 1,
      inStock: true,
    }));

    await Product.insertMany(transformedProducts);
    console.log(`${transformedProducts.length} products seeded successfully`);

    // create default admin user if specified in env
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      const User = (await import('../models/User.js')).default;
      const existingAdmin = await User.findOne({ email: adminEmail });
      if (!existingAdmin) {
        await User.create({
          name: 'Admin',
          email: adminEmail,
          password: adminPassword,
          isAdmin: true,
        });
        console.log('Default admin user created');
      } else {
        console.log('Admin user already exists');
      }
    }

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
