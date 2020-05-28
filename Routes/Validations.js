const db = require('../data/db-helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// -> Response Function
const { resp } = require('../Utils');

// -> User Validations

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
    let final = {};

    if (!req.body)
        return resp(res, 'Nothing was provided in the body to update.', 400);
    if (!req.params.id || parseInt(req.params.id) <= 0 || isNaN(parseInt(req.params.id)))
        return resp(res, 'A valid and postitive ID must be provided.', 400)

    if (!req.body.username && !req.body.password && !req.body.role_id)
        return resp(res, `A username, role_id, and/or password must be provided to update.`, 400);

    if (req.body.username) {
        const exists = await db.getUserByName(req.body.username);
        if (exists) return resp(res, 'Username already exists.', 400);
    
        final = {
            ...final,
            username: req.body.username,
        }
    }

    if (req.body.password) {
        req.body.password = await bcrypt.hashSync(req.body.password, 10);

        final = {
            ...final,
            password: req.body.password,
        }
    }

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
        if (!roleExists) return resp(res, 'Role does not exist.', 404);

        final = {
            ...final,
            role_id: req.body.role_id,
        }
    }

    req.user = final;
    next();
};

// -> Ticket Validations

const validateNewTicket = async (req, res, next) => {
    
    if (!req.body ||
        !req.body.title ||
        !req.body.content ||
        !req.body.author ||
        !req.body.category_id) {
        return resp(res, `Please provide 'title', 'content', 'author' (a user id), and 'category_id'.`, 400);
    }

    // Make sure title is string and is at least one character long.
    if (typeof req.body.title !== 'string') return resp(res, 'Title must be a string.', 400);
    if (req.body.title.length <= 0) return resp(res, 'Title must be at least 1 character long.', 400);

    // Make sure content is string and is at least one character long.
    if (typeof req.body.content !== 'string') return resp(res, 'Content must be a string.', 400);
    if (req.body.content.length <= 0) return resp(res, 'Content must be at least 1 character long.', 400);

    // Make sure author is valid number.
    if (isNaN(parseInt(req.body.author))) return resp(resp, 'Author must be a valid user ID.', 400);
    // Parse author to int
    if (typeof req.body.author === 'string') req.body.author = parseInt(req.body.author);
    
    // Check to make sure author is a valid user.
    const authorExists = await db.getUserByID(req.body.author);
    if (!authorExists) return resp(res, 'Author does not exist.', 404);

    // Make sure category ID is valid number.
    if (isNaN(parseInt(req.body.category_id))) {
        const cats = await db.getAllCatgories();
        return resp(resp, {
            message: 'category_id must be a valid category ID. See below:',
            categories: cats
        }, 400);
    }
    // Parse category_id to int
    if (typeof req.body.category_id === 'string') req.body.category_id = parseInt(req.body.category_id);
    
    // Check to make sure category is valid.
    const catExists = await db.getCategoryByID(req.body.category_id);
    if (!catExists) {
        const cats = await db.getAllCatgories();
        return resp(resp, {
            message: 'category_id must be a valid category ID. See below:',
            categories: cats
        }, 400);
    }
    
    // Set defaults.
    req.body.posted_time = Date.now().toString();
    req.body.resolved = 'false';

    req.ticket = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        category_id: req.body.category_id,
        posted_time: req.body.posted_time,
        resolved: req.body.resolved
    }
    next();
}

const validateUpdateTicket = async (req, res, next) => {
    let final = {};

    // Validate ID params.
    if (!req.params.id) return resp(res, 'Please provide a valid ID parameter.', 400);
    if (isNaN(parseInt(req.params.id))) return resp(res, 'Please provide a valid ID parameter.', 400);
    const ticketExists = await db.getTicketByID(req.params.id);
    if (!ticketExists) return resp(resp, 'Ticket does not exist.', 404);

    if (req.body.title) {
        // Make sure title is string and is at least one character long.
        if (typeof req.body.title !== 'string') return resp(res, 'Title must be a string.', 400);
        if (req.body.title.length <= 0) return resp(res, 'Title must be at least 1 character long.', 400);
        final = {
            ...final,
            title: req.body.title,
        }
    }

    if (req.body.content) {
        // Make sure title is string and is at least one character long.
        if (typeof req.body.content !== 'string') return resp(res, 'Title must be a string.', 400);
        if (req.body.content.length <= 0) return resp(res, 'Title must be at least 1 character long.', 400);
        final = {
            ...final,
            content: req.body.content,
        }
    }

    if (req.body.posted_time) return resp(res, 'Can not update posted_time.', 400);

    if (req.body.author) {
        // Make sure author is valid number.
        if (isNaN(parseInt(req.body.author))) return resp(resp, 'Author must be a valid user ID.', 400);
        // Parse author to int
        if (typeof req.body.author === 'string') req.body.author = parseInt(req.body.author);
        
        // Check to make sure author is a valid user.
        const authorExists = await db.getUserByID(req.body.author);
        if (!authorExists) return resp(res, 'Author does not exist.', 404);
        final = {
            ...final,
            author: req.body.author,
        }
    }

    if (req.body.resolved) {
        req.body.resolved = req.body.resolved.toLowerCase();
        if (typeof req.body.resolved === 'boolean') req.body.resolved = req.body.resolved.toString();
        if (req.body.resolved.toLowerCase() !== 'false' && req.body.resolved !== 'true')
            return resp(res, 'Resolved must be "true" or "false".', 400);
        final = {
            ...final,
            resolved: req.body.resolved,
        }
    }

    if (req.body.resolved_time) {
        if (isNaN(parseInt(req.body.resolved))) return resp(res, 'resolved_time must be a valid number.', 400);
        if (typeof req.body.resolved_time === 'string') req.body.resolved_time = parseInt(req.body.resolved_time);
        if (new Date(req.body.resolved_time).toString() === 'Invalid Date') return resp(res, 'resolved_time must be a valid date number.', 400);
        
        final = {
            ...final,
            resolved_time: req.body.resolved_time,
        }
    }

    if (req.body.resolved_by) {
        // Make sure resolved_by is valid number.
        if (isNaN(parseInt(req.body.resolved_by))) return resp(resp, 'Resolved_by must be a valid user ID.', 400);
        // Parse resolved_by to int
        if (typeof req.body.resolved_by === 'string') req.body.resolved_by = parseInt(req.body.resolved_by);
        
        // Check to make sure resolved_by is a valid user.
        const resolvedbyExists = await db.getUserByID(req.body.resolved_by);
        if (!resolvedbyExists) return resp(res, 'Resolved_by does not exist.', 404);

        final = {
            ...final,
            resolved_by: req.body.resolved_by,
        }
    }

    if (req.body.category_id) {
        // Make sure category ID is valid number.
        if (isNaN(parseInt(req.body.category_id))) {
            const cats = await db.getAllCatgories();
            return resp(resp, {
                message: 'category_id must be a valid category ID. See below:',
                categories: cats
            }, 400);
        }
        // Parse category_id to int
        if (typeof req.body.category_id === 'string') req.body.category_id = parseInt(req.body.category_id);
        
        // Check to make sure category is valid.
        const catExists = await db.getCategoryByID(req.body.category_id);
        if (!catExists) {
            const cats = await db.getAllCatgories();
            return resp(resp, {
                message: 'category_id must be a valid category ID. See below:',
                categories: cats
            }, 400);
        }

        final = {
            ...final,
            category_id: req.body.category_id,
        }
    }

    req.ticket = final;
    next();
}

// -> Comment Validations

const validateNewComment = async (req, res, next) => {
    if (!req.body ||
        !req.body.message ||
        !req.body.author ||
        !req.body.ticket_id) {
        return resp(res, `Please provide 'message', 'author', and 'ticket_id'.`, 400);
    }

    // Make sure message is a string with at least one character.
    if(typeof req.body.message !== 'string' || req.body.message.length <= 0) return resp(res, 'Message must be a string with one or more characters.', 400);

    // Make sure author is valid number.
    if (isNaN(parseInt(req.body.author))) return resp(resp, 'Author must be a valid user ID.', 400);
    // Parse author to int
    if (typeof req.body.author === 'string') req.body.author = parseInt(req.body.author);
    
    // Check to make sure author is a valid user.
    const authorExists = await db.getUserByID(req.body.author);
    if (!authorExists) return resp(res, 'Author does not exist.', 404);

    // Make sure author is valid number.
    if (isNaN(parseInt(req.body.ticket_id))) return resp(resp, 'Ticket ID must be a valid number.', 400);
    // Parse author to int
    if (typeof req.body.ticket_id === 'string') req.body.ticket_id = parseInt(req.body.ticket_id);
    
    // Check to make sure author is a valid user.
    const ticketExists = await db.getTicketByID(req.body.ticket_id);
    if (!ticketExists) return resp(res, 'Ticket does not exist.', 404);

    // Set defaults.
    req.body.posted_time = Date.now().toString();

    req.comment = {
        message: req.body.message,
        author: req.body.author,
        ticket_id: req.body.ticket_id,
        posted_time: req.body.posted_time
    }
    next();
}

const validateUpdateComment = async (req, res, next) => {
    let final = {};
    
    // Validate ID params.
    if (!req.params.id) return resp(res, 'Please provide a valid ID parameter.', 400);
    if (isNaN(parseInt(req.params.id))) return resp(res, 'Please provide a valid ID parameter.', 400);
    const commentExists = await db.getCommentByID(req.params.id);
    if (!commentExists) return resp(resp, 'Comment does not exist.', 404);

    if (req.body.id) return resp(res, 'ID can not be updated.', 400);
    if (req.body.posted_time) return resp(res, 'Posted time can not be updated.', 400);

    if (req.body.author) {
        // Make sure author is valid number.
        if (isNaN(parseInt(req.body.author))) return resp(resp, 'Author must be a valid user ID.', 400);
        // Parse author to int
        if (typeof req.body.author === 'string') req.body.author = parseInt(req.body.author);
        
        // Check to make sure author is a valid user.
        const authorExists = await db.getUserByID(req.body.author);
        if (!authorExists) return resp(res, 'Author does not exist.', 404);

        final = {
            ...final,
            author: req.body.author,
        }
    }

    if (req.body.message) {
        // Make sure message is string and is at least one character long.
        if (typeof req.body.message !== 'string') return resp(res, 'Message must be a string.', 400);
        if (req.body.message.length <= 0) return resp(res, 'Message must be at least 1 character long.', 400);
        
        final = {
            ...final,
            message: req.body.message,
        }
    }

    if (req.body.ticket_id) {
        // Make sure author is valid number.
        if (isNaN(parseInt(req.body.ticket_id))) return resp(resp, 'Ticket ID must be a valid number.', 400);
        // Parse author to int
        if (typeof req.body.ticket_id === 'string') req.body.ticket_id = parseInt(req.body.ticket_id);
        
        // Check to make sure author is a valid user.
        const ticketExists = await db.getUserByID(req.body.ticket);
        if (!ticketExists) return resp(res, 'Ticket does not exist.', 404);

        final = {
            ...final,
            ticket_id: req.body.ticket_id,
        }
    }

    req.comment = final;
    next();

}

// -> Authentication Validations

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
    // -> User Validations
    validateNewUser,
    validateUpdateUser,

    // -> Authentication Validations
    validateLogin,
    protected,

    // -> Ticket Validations
    validateNewTicket,
    validateUpdateTicket,

    // -> Comment Validations
    validateNewComment,
    validateUpdateComment,
}