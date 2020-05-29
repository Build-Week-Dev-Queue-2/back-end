// -> Express Router
const server = require('express').Router();

// -> DB Helper
const db = require('../data/db-helper');

// -> Validations
const {
    protectedRoute,
    validateUpdateUser
} = require('./Validations');

// -> Response Function
const { resp, removePassword } = require('../Utils');

// -> GET '/' - All users.
server.get('/', protectedRoute, (req, res) => {
    return db.getAllUsers()
        .then(users => {
            resp(res, removePassword(users))
        })
        .catch(error => resp(res, error.message, 500));
})

// -> GET '/:id' - Single user by ID
server.get('/:id', protectedRoute, (req, res) => {
    const { id } = req.params;
    
    return db.getUserByID(id)
        .then(user => resp(res, removePassword(user)))
        .catch(error => resp(res, error.message, 500));
})

// -> GET '/:id/tickets' - Array of tickets by author.
server.get('/:id/tickets', protectedRoute, (req, res) => {
    const { id } = req.params;
    
    return db.getTicketsByAuthor(id)
        .then(tickets => resp(res, tickets))
        .catch(error => resp(res, error.message, 500));
})

// -> PUT '/:id' - Update a user by ID
server.put('/:id', protectedRoute, validateUpdateUser, (req, res) => {
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
server.delete('/:id', protectedRoute, (req, res) => {
    const { id } = req.params;
    
    return db.removeUser(id)
        .then(async () => resp(res, `User #${id} was deleted.`))
        .catch(error => resp(res, error.message, 500));
})

module.exports = server;
