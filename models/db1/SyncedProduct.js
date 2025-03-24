const { DataTypes } = require('sequelize');
const { db1 } = require('../../config/database');

let SyncedProduct;

async function initializeModel() {
    const database = await db1();
    SyncedProduct = database.define('SyncedProduct', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    originalId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    lastSyncedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});
    return SyncedProduct;
}

initializeModel();

module.exports = {
    getModel: () => SyncedProduct,
    initialize: initializeModel
};
