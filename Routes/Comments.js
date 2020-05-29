// -> Express Router
const server = require('express').Router();

// -> DB Helper
const db = require('../data/db-helper');

// -> Validations
const {
    protectedRoute,
    validateNewComment,
    validateUpdateComment
} = require('./Validations');

// -> Response Function
const { resp } = require('../Utils');

// -> GET '/' - All comments.
server.get('/', protectedRoute, (req, res) => {
    return db.getAllComments()
        .then(comments => resp(res, comments))
        .catch(error => resp(res, error.message, 500));
})

// -> GET '/:id' - Single comment by ID
server.get('/:id', protectedRoute, (req, res) => {
    const { id } = req.params;
    
    return db.getCommentByID(id)
        .then(comment => resp(res, comment))
        .catch(error => resp(res, error.message, 500));
})

// -> PUT '/:id' - Update a comment by ID
server.put('/:id', protectedRoute, validateUpdateComment, (req, res) => {
    const { id } = req.params;
    
    return db.updateComment(id, req.comment)
        .then(async comment => {
            comment = await db.getCommentByID(id);
            return resp(res, comment);
        })
        .catch(error => resp(res, error.message, 500));
});

// -> POST '/' - Create new comment.
server.post('/', protectedRoute, validateNewComment, (req, res) => {
    return db.addComment(req.comment)
        .then(async ([id]) => {
            const comment = await db.getCommentByID(id);
            return resp(res, comment, 201);
        })
        .catch(error => resp(res, error.message, 500));
});

// -> DELETE '/:id' - Delete a user by ID
server.delete('/:id', protectedRoute, (req, res) => {
    const { id } = req.params;
    
    return db.removeComment(id)
        .then(async () => resp(res, `Comment #${id} was deleted.`))
        .catch(error => resp(res, error.message, 500));
})

module.exports = server;