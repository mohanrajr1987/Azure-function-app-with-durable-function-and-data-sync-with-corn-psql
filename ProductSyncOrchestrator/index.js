const df = require('durable-functions');

module.exports = df.orchestrator(function* (context) {
    const outputs = [];
    
    // Get the products from DB2
    const products = yield context.df.callActivity('GetProducts');
    
    // Sync each product to DB1
    for (const product of products) {
        outputs.push(yield context.df.callActivity('SyncProduct', product));
    }
    
    return outputs;
});
