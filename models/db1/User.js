const { DataTypes } = require('sequelize');
const { db1 } = require('../../config/database');

let User;

async function initializeModel() {
    const database = await db1();
    User = database.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    return User;
}

initializeModel();

module.exports = {
    getModel: () => User,
    initialize: initializeModel
};
