const moment = require('moment');
const Product = require('../models/db2/Product');
const SyncedProduct = require('../models/db1/SyncedProduct');
const { Op } = require('sequelize');

module.exports = async function (context, myTimer) {
    try {
        const timeStamp = new Date().toISOString();
        context.log('ProductSync Timer trigger function started at:', timeStamp);

        // Get all products from DB2 that were updated in the last 24 hours
        const updatedProducts = await Product.findAll({
            where: {
                updatedAt: {
                    [Op.gte]: moment().subtract(24, 'hours').toDate()
                }
            }
        });

        for (const product of updatedProducts) {
            // Check if product exists in DB1
            const syncedProduct = await SyncedProduct.findOne({
                where: { originalId: product.id }
            });

            if (syncedProduct) {
                // Update existing product
                await syncedProduct.update({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    lastSyncedAt: new Date()
                });
            } else {
                // Create new synced product
                await SyncedProduct.create({
                    originalId: product.id,
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    lastSyncedAt: new Date()
                });
            }
        }

        context.log('ProductSync completed successfully');
    } catch (error) {
        context.log.error('Error in ProductSync:', error);
        throw error;
    }
};
