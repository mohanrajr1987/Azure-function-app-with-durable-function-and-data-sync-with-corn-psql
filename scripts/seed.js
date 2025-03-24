require('dotenv').config();
const { Sequelize } = require('sequelize');
const { Product } = require('../models/product');
const { User } = require('../models/user');

const sampleProducts = [
  {
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99
  },
  {
    name: 'Smartphone',
    description: 'Latest smartphone model',
    price: 699.99
  },
  {
    name: 'Tablet',
    description: '10-inch tablet',
    price: 299.99
  }
];

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com'
  }
];

async function seed() {
  try {
    // PostgreSQL Connection
    const pgSequelize = new Sequelize({
      dialect: 'postgres',
      host: process.env.PG_HOST || 'localhost',
      port: process.env.PG_PORT || 5432,
      username: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      database: process.env.PG_DATABASE || 'postgres',
      logging: false
    });

    // Test PostgreSQL connection
    await pgSequelize.authenticate();
    console.log('PostgreSQL connection established successfully.');

    // Seed products
    await Product.bulkCreate(sampleProducts);
    console.log('Sample products seeded successfully.');

    // Seed users
    await User.bulkCreate(sampleUsers);
    console.log('Sample users seeded successfully.');

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
