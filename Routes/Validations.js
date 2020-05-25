const db = require('../data/db-helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// -> Response Function
const { resp } = require('../Utils');

const validateNewUser = async (req, res, next) => {
    if (!req.body || !req.body.username || !req.body.password || !req.body.role_id)
        return resp(res, `Invalid POST request. Make sure 'username', 'password', and 'role_id' are in the body of the request.`, 400);

    const exists = await db.getUserByName(req.body.username);
    if (exists)
        return resp(res, 'Username already exists.', 400);

    req.body.password = await bcrypt.hashSync(req.body.password, 10);

    try {
        req.body.role_id = parseInt(req.body.role_id);
        const roles = await db.getAllRoles();
        if (isNaN(req.body.role_id))
            return resp(res, {
                message: 'The role_id is invalid, choose from role_id below:',
                roles
            }, 400);
    } catch (error) {
        const roles = await db.getAllRoles();
        return resp(res, {
            message: 'The role_id is invalid, choose from role_id below:',
            roles
        }, 400);
    }

    const roleExists = db.getRoleByID(req.body.role_id);
    if (!roleExists)
        return resp(res, 'Role does not exist.', 404);

    req.user = req.body;
    next();
};

const validateUpdateUser = async (req, res, next) => {
    if (!req.body)
        return resp(res, 'Nothing was provided in the body to update.', 400);
    if (!req.params.id || parseInt(req.params.id) <= 0 || isNaN(parseInt(req.params.id)))
        return resp(res, 'A valid and postitive ID must be provided.', 400)

    if (!req.body.username && !req.body.password && !req.body.role_id)
        return resp(res, `A username, role_id, and/or password must be provided to update.`, 400);

    if (req.body.username) {
        const exists = await db.getUserByName(req.body.username);
        if (exists)
            return resp(res, 'Username already exists.', 400);
    }

    if (req.body.password) req.body.password = await bcrypt.hashSync(req.body.password, 10);

    if (req.body.role_id) {
        try {
            req.body.role_id = parseInt(req.body.role_id);
            const roles = await db.getAllRoles();
            if (isNaN(req.body.role_id))
                return resp(res, {
                    message: 'The role_id is invalid, choose from role_id below:',
                    roles
                }, 400);
        } catch (error) {
            const roles = await db.getAllRoles();
            return resp(res, {
                message: 'The role_id is invalid, choose from role_id below:',
                roles
            }, 400);
        }

        const roleExists = db.getRoleByID(req.body.role_id);
        if (!roleExists)
            return resp(res, 'Role does not exist.', 404);
    }

    req.user = req.body;
    next();
};

const validateLogin = async (req, res, next) => {
    if (!req.body || !req.body.username || !req.body.password)
        return resp(res, `Invalid POST request. Make sure 'username' and 'password' are in the body of the request.`, 400);

    const user = await db.getUserByName(req.body.username);

    if (!user)
        return resp(res, 'Invalid credentials.', 400);

    const correctPassword = await bcrypt.compareSync(req.body.password, user.password);

    if (!correctPassword)
        return resp(res, 'Invalid credentials.', 400);

    req.user = user;
    next();
};

const protected = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token)
        return resp(res, 'Client must provide authorization information.', 400);

    return await jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
        if (err) {
            return resp(res, 'Client must provide authorization information.', 400);
        } else {
            req.jwt = token;
            next();
        }
    })
}

module.exports = {
    protected,
    validateLogin,
    validateNewUser,
    validateUpdateUser
}