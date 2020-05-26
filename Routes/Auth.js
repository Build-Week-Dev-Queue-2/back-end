// -> Express
const server = require('express').Router();

// -> DB Manager
const db = require('../data/db-helper');

// -> JSON Web Token
const jwt = require('jsonwebtoken');

// -> Response Function
const { resp, removePassword } = require('../Utils');

const {
    validateNewUser,
    validateLogin
} = require('./Validations');

server.post('/login', validateLogin, async (req, res) => {
    const { user } = req;
    const token = await newToken(user);
    return resp(res, {
        message: `Welcome back, ${user.username}!`,
        user: {
            ...removePassword(user)
        },
        token,
    }, 200);
});

server.post('/register', validateNewUser, (req, res) => {
    let { user } = req;
    return db.addUser(user)
        .then(async ([id]) => {
            const madeUser = await db.getUserByID(id);
            
            const token = await newToken(user);
            return resp(res, {
                message: `${user.username} created successfully.`,
                user: removePassword(madeUser),
                token,
            }, 201);
        })
});

const newToken = user => {
    const { userid, id, username, role_id, roleid } = user;

    const payload = {
        subject: id || userid,
        username,
        roleid: roleid || role_id
    };

    const config = {
        expiresIn: '1d',
    };

    return jwt.sign(payload, process.env.JWT_SECRET, config);
}

module.exports = server;