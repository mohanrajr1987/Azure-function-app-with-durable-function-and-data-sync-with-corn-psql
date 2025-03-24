const { DataTypes } = require('sequelize');
const { db2 } = require('../../config/database');

let Product;

async function initializeModel() {
    const database = await db2();
    Product = database.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});
    return Product;
}

initializeModel();

module.exports = {
    getModel: () => Product,
    initialize: initializeModel
};
