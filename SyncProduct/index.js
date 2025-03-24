const { getModel: getSyncedProduct } = require('../models/db1/SyncedProduct');

module.exports = async function (context, product) {
    try {
        const SyncedProduct = getSyncedProduct();
        if (!SyncedProduct) {
            throw new Error('SyncedProduct model not initialized');
        }

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
            return { status: 'updated', id: syncedProduct.id };
        } else {
            // Create new synced product
            const newSyncedProduct = await SyncedProduct.create({
                originalId: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                lastSyncedAt: new Date()
            });
            return { status: 'created', id: newSyncedProduct.id };
        }
    } catch (error) {
        context.log.error('Error in SyncProduct activity:', error);
        throw error;
    }
};
