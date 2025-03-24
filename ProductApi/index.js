const { getModel: getProduct } = require('../models/db2/Product');
const { getModel: getSyncedProduct } = require('../models/db1/SyncedProduct');

module.exports = async function (context, req) {
    try {
        const method = req.method;
        const id = req.params.id;
        const Product = getProduct();
        const SyncedProduct = getSyncedProduct();

        if (!Product || !SyncedProduct) {
            context.res = { status: 500, body: { message: 'Database not initialized' } };
            return;
        }

        switch (method) {
            case 'GET':
                if (id) {
                    const product = await Product.findByPk(id);
                    if (!product) {
                        context.res = { status: 404, body: { message: 'Product not found' } };
                        return;
                    }
                    context.res = { body: product };
                } else {
                    const products = await Product.findAll();
                    context.res = { body: products };
                }
                break;

            case 'POST':
                const newProduct = await Product.create(req.body);
                // Create synced product in DB1
                await SyncedProduct.create({
                    originalId: newProduct.id,
                    name: newProduct.name,
                    description: newProduct.description,
                    price: newProduct.price
                });
                context.res = { status: 201, body: newProduct };
                break;

            case 'PUT':
                if (!id) {
                    context.res = { status: 400, body: { message: 'ID is required' } };
                    return;
                }
                const [updated] = await Product.update(req.body, { where: { id } });
                if (!updated) {
                    context.res = { status: 404, body: { message: 'Product not found' } };
                    return;
                }
                // Update synced product in DB1
                await SyncedProduct.update(req.body, { where: { originalId: id } });
                const updatedProduct = await Product.findByPk(id);
                context.res = { body: updatedProduct };
                break;

            case 'DELETE':
                if (!id) {
                    context.res = { status: 400, body: { message: 'ID is required' } };
                    return;
                }
                const deleted = await Product.destroy({ where: { id } });
                if (!deleted) {
                    context.res = { status: 404, body: { message: 'Product not found' } };
                    return;
                }
                // Delete synced product in DB1
                await SyncedProduct.destroy({ where: { originalId: id } });
                context.res = { status: 204 };
                break;
        }
    } catch (error) {
        context.log.error('Error in ProductApi:', error);
        context.res = {
            status: 500,
            body: { message: 'Internal server error', error: error.message }
        };
    }
};
