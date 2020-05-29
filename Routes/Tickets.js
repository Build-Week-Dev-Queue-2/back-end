// -> Express Router
const server = require('express').Router();

// -> DB Helper
const db = require('../data/db-helper');

// -> Validations
const {
    protectedRoute,
    validateUpdateTicket,
    validateNewTicket
} = require('./Validations');

// -> Response Function
const { resp } = require('../Utils');

// -> GET '/' - All tickets.
server.get('/', protectedRoute, (req, res) => {
    return db.getAllTickets()
        .then(tickets => resp(res, tickets))
        .catch(error => resp(res, error.message, 500));
})

// -> GET '/:id' - Single ticket by ID
server.get('/:id', protectedRoute, (req, res) => {
    const { id } = req.params;
    
    return db.getTicketByID(id)
        .then(ticket => resp(res, ticket))
        .catch(error => resp(res, error.message, 500));
})

// -> GET '/:id/comments' - Get all comments by ticket ID.
server.get('/:id/comments', (req, res) => {
    const { id } = req.params;

    return db.getCommentsByTicketID(id)
        .then(comments => resp(res, comments))
        .catch(error => resp(res, error.message, 500));
})

// -> PUT '/:id' - Update a ticket by ID
server.put('/:id', protectedRoute, validateUpdateTicket, (req, res) => {
    const { id } = req.params;
    
    return db.updateTicket(id, req.ticket)
        .then(async ticket => {
            ticket = await db.getTicketByID(id);
            return resp(res, ticket);
        })
        .catch(error => resp(res, error.message, 500));
});

// -> POST '/' - Create new ticket.
server.post('/', protectedRoute, validateNewTicket, (req, res) => {
    return db.addTicket(req.ticket)
        .then(async ([id]) => {
            const ticket = await db.getTicketByID(id);
            return resp(res, ticket, 201);
        })
        .catch(error => resp(res, error.message, 500));
});

// -> DELETE '/:id' - Delete a user by ID
server.delete('/:id', protectedRoute, (req, res) => {
    const { id } = req.params;
    
    return db.removeTicket(id)
        .then(async () => resp(res, `Ticket #${id} was deleted.`))
        .catch(error => resp(res, error.message, 500));
})

module.exports = server;