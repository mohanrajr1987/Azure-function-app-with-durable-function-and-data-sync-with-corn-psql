const df = require('durable-functions');
const { initializeDatabases } = require('../config/database');

module.exports = async function (context, req) {
    try {
        // Initialize database connections
        await initializeDatabases();

        const client = df.getClient(context);
        const instanceId = await client.startNew(req.params.functionName, undefined, undefined);

        const status = await client.getStatus(instanceId);

        context.res = {
            body: {
                id: instanceId,
                status: status,
                message: 'Product sync orchestration started'
            }
        };
    } catch (error) {
        context.log.error('Error starting product sync:', error);
        context.res = {
            status: 500,
            body: {
                message: 'Failed to start product sync',
                error: error.message
            }
        };
    }
};
