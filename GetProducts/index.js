const { getModel: getProduct } = require('../models/db2/Product');

module.exports = async function (context) {
    try {
        const Product = getProduct();
        if (!Product) {
            throw new Error('Product model not initialized');
        }
        const products = await Product.findAll();
        return products;
    } catch (error) {
        context.log.error('Error in GetProducts activity:', error);
        throw error;
    }
};
