require('dotenv').config();
const { Sequelize } = require('sequelize');
const { Product } = require('../models/product');
const { User } = require('../models/user');

async function migrate() {
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

    // Sync all models
    await Product.sync({ alter: true });
    await User.sync({ alter: true });

    console.log('Database migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrate();
