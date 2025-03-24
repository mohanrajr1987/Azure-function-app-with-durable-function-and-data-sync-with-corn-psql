require('dotenv').config();
const { Sequelize } = require('sequelize');

async function createDatabaseConnection(dbConfig, fallbackConfig) {
    try {
        const db = new Sequelize(
            dbConfig.database,
            dbConfig.username,
            dbConfig.password,
            dbConfig.options
        );
        await db.authenticate();
        console.log(`Successfully connected to ${dbConfig.options.dialect} database`);
        return db;
    } catch (error) {
        console.log(`Failed to connect to ${dbConfig.options.dialect} database:`, error.message);
        console.log(`Attempting to connect to PostgreSQL fallback...`);
        
        try {
            const fallbackDb = new Sequelize(
                fallbackConfig.database,
                fallbackConfig.username,
                fallbackConfig.password,
                fallbackConfig.options
            );
            await fallbackDb.authenticate();
            console.log('Successfully connected to PostgreSQL fallback database');
            return fallbackDb;
        } catch (fallbackError) {
            console.error('Failed to connect to PostgreSQL fallback:', fallbackError.message);
            throw new Error('Failed to connect to both primary and fallback databases');
        }
    }
}

// Database configurations
const mssqlConfig1 = {
    database: process.env.DB1_NAME,
    username: process.env.DB1_USER,
    password: process.env.DB1_PASSWORD,
    options: {
        host: process.env.DB1_HOST,
        port: process.env.DB1_PORT,
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: true
            }
        }
    }
};

const mssqlConfig2 = {
    database: process.env.DB2_NAME,
    username: process.env.DB2_USER,
    password: process.env.DB2_PASSWORD,
    options: {
        host: process.env.DB2_HOST,
        port: process.env.DB2_PORT,
        dialect: 'mssql',
        dialectOptions: {
            options: {
                encrypt: true
            }
        }
    }
};

const pgConfig1 = {
    database: process.env.PG_DB1_NAME || process.env.DB1_NAME,
    username: process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD || 'password',
    options: {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: false
        }
    }
};

const pgConfig2 = {
    database: process.env.PG_DB2_NAME || process.env.DB2_NAME,
    username: process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD || 'password',
    options: {
        host: process.env.PG_HOST || 'localhost',
        port: process.env.PG_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: false
        }
    }
};

// Database instances
let db1Instance = null;
let db2Instance = null;

// Initialize database connections
async function initializeDatabases() {
    if (!db1Instance) {
        db1Instance = await createDatabaseConnection(mssqlConfig1, pgConfig1);
    }
    if (!db2Instance) {
        db2Instance = await createDatabaseConnection(mssqlConfig2, pgConfig2);
    }
    return { db1Instance, db2Instance };
}

// Database getter functions
async function db1() {
    if (!db1Instance) {
        await initializeDatabases();
    }
    return db1Instance;
}

async function db2() {
    if (!db2Instance) {
        await initializeDatabases();
    }
    return db2Instance;
}

module.exports = {
    db1,
    db2,
    initializeDatabases
};
