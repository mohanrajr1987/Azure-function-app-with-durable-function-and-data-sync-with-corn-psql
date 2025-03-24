const { getModel: getUser } = require('../models/db1/User');

module.exports = async function (context, req) {
    try {
        const method = req.method;
        const id = req.params.id;
        const User = getUser();

        if (!User) {
            context.res = { status: 500, body: { message: 'Database not initialized' } };
            return;
        }

        switch (method) {
            case 'GET':
                if (id) {
                    const user = await User.findByPk(id);
                    if (!user) {
                        context.res = { status: 404, body: { message: 'User not found' } };
                        return;
                    }
                    context.res = { body: user };
                } else {
                    const users = await User.findAll();
                    context.res = { body: users };
                }
                break;

            case 'POST':
                const newUser = await User.create(req.body);
                context.res = { status: 201, body: newUser };
                break;

            case 'PUT':
                if (!id) {
                    context.res = { status: 400, body: { message: 'ID is required' } };
                    return;
                }
                const [updated] = await User.update(req.body, { where: { id } });
                if (!updated) {
                    context.res = { status: 404, body: { message: 'User not found' } };
                    return;
                }
                const updatedUser = await User.findByPk(id);
                context.res = { body: updatedUser };
                break;

            case 'DELETE':
                if (!id) {
                    context.res = { status: 400, body: { message: 'ID is required' } };
                    return;
                }
                const deleted = await User.destroy({ where: { id } });
                if (!deleted) {
                    context.res = { status: 404, body: { message: 'User not found' } };
                    return;
                }
                context.res = { status: 204 };
                break;
        }
    } catch (error) {
        context.log.error('Error in UserApi:', error);
        context.res = {
            status: 500,
            body: { message: 'Internal server error', error: error.message }
        };
    }
};
