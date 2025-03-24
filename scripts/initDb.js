require('dotenv').config();
const { db1, db2, initializeDatabases } = require('../config/database');
const { initialize: initializeUser, getModel: getUser } = require('../models/db1/User');
const { initialize: initializeProduct, getModel: getProduct } = require('../models/db2/Product');
const { initialize: initializeSyncedProduct, getModel: getSyncedProduct } = require('../models/db1/SyncedProduct');

const dummyUsers = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
    { name: 'Bob Johnson', email: 'bob@example.com' }
];

const dummyProducts = [
    { name: 'Laptop', description: 'High-performance laptop', price: 999.99 },
    { name: 'Smartphone', description: 'Latest smartphone model', price: 699.99 },
    { name: 'Tablet', description: '10-inch tablet', price: 299.99 }
];

async function initializeDb() {
    try {
        // Initialize database connections and models
        await initializeDatabases();
        await Promise.all([
            initializeUser(),
            initializeProduct(),
            initializeSyncedProduct()
        ]);
        
        // Get model instances
        const User = getUser();
        const Product = getProduct();
        const SyncedProduct = getSyncedProduct();
        
        // Sync database models
        const db1Instance = await db1();
        const db2Instance = await db2();
        await db1Instance.sync({ force: true });
        await db2Instance.sync({ force: true });
        
        console.log('Database tables created successfully');

        // Create dummy users
        const createdUsers = await User.bulkCreate(dummyUsers);
        console.log('Dummy users created:', createdUsers.map(user => user.name));

        // Create dummy products
        const createdProducts = await Product.bulkCreate(dummyProducts);
        console.log('Dummy products created:', createdProducts.map(product => product.name));

        // Sync products to DB1
        const syncedProducts = await SyncedProduct.bulkCreate(
            createdProducts.map(product => ({
                originalId: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                lastSyncedAt: new Date()
            }))
        );
        console.log('Products synced to DB1:', syncedProducts.map(product => product.name));

        console.log('Database initialization completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDb();
