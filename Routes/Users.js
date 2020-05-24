// -> Express Router
const server = require('express').Router();

// -> DB Helper
const db = require('../data/db-helper');

// -> Validations
const {
    protected,
    validateUpdateUser
} = require('./Validations');

// -> Response Function
const { resp } = require('../Utils');

// -> GET '/' - All users.
server.get('/', protected, (req, res) => {
    return db.getAllUsers()
        .then(users => {
            resp(res, removePassword(users))
        })
        .catch(error => resp(res, error.message, 500));
})

// -> GET '/:id' - Single user by ID
server.get('/:id', protected, (req, res) => {
    const { id } = req.params;
    
    return db.getUserByID(id)
        .then(user => resp(res, removePassword(user)))
        .catch(error => resp(res, error.message, 500));
})

// -> PUT '/:id' - Delete a user by ID
server.put('/:id', protected, validateUpdateUser, (req, res) => {
    const { id } = req.params;
    
    return db.updateUser(id, req.user)
        .then(async user => {
            user = await db.getUserByID(id);
            user = removePassword(user);
            return resp(res, user);
        })
        .catch(error => resp(res, error.message, 500));
})

// -> DELETE '/:id' - Delete a user by ID
server.delete('/:id', protected, (req, res) => {
    const { id } = req.params;
    
    return db.removeUser(id)
        .then(async () => resp(res, `User #${id} was deleted.`))
        .catch(error => resp(res, error.message, 500));
})

const removePassword = list => {
    if (!list.length) { 
        const { userid, username, role, roleid } = list;
        return {
            userid, username, role, roleid
        }
    }
    return list.map(user => {
        const { userid, username, role, roleid } = user;
        return {
            userid, username, role, roleid
        }
    })
}

module.exports = server;
