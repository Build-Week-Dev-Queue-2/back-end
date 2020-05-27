// -> Knex Database (DBMS)
const knex = require('knex');
const config = require('../knexfile.js');
const db = knex(config[process.env.ENV || 'development']);

module.exports = {
    // -> User Functions
    getAllUsers: () => db('users as u')
        .join('roles as r', 'u.role_id', '=', 'r.id')
        .select(
            'u.id as user_id',
            'u.username',
            'u.password',
            'r.role',
            'u.role_id'
        ),
    getUserByID: id => db('users as u')
        .where('u.id', id)
        .join('roles as r', 'u.role_id', '=', 'r.id')
        .select(
            'u.id as user_id',
            'u.username',
            'u.password',
            'r.role',
            'r.id as role_id'
        )
        .first(),
    getUserByName: name => db('users as u')
        .where('u.username', name)
        .join('roles as r', 'u.role_id', '=', 'r.id')
        .select(
            'u.id as user_id',
            'u.username',
            'u.password',
            'r.role',
            'r.id as role_id'
        )
        .first(),
    getUserBySlackID: id => db('users as u')
        .where('u.slack_id', id)
        .first(),
    addUser: user => db('users').insert(user),
    updateUser: (id, update) => db('users').where({ id }).update(update),
    removeUser: id => db('users').where({ id }).del(),

    // -> Ticket Functions
    getAllTickets: () => db('tickets as t')
        .join('users as u', 'u.id', '=', 't.author')
        .join('categories as c', 'c.id', '=', 't.category_id')
        .select(
            't.id as ticket_id',
            't.title',
            't.content',
            't.posted_time',
            'u.username as author',
            't.resolved',
            't.resolved_by',
            't.resolved_time',
            'c.name as category'
        ),
    getTicketByID: id => db('tickets as t')
        .where('t.id', id)
        .join('users as u', 'u.id', '=', 't.author')
        .join('categories as c', 'c.id', '=', 't.category_id')
        .select(
            't.id as ticket_id',
            't.title',
            't.content',
            't.posted_time',
            'u.username as author',
            't.resolved',
            't.resolved_by',
            't.resolved_time',
            'c.name as category'
        ).first(),
    getResolvedTickets: () => db('tickets as t')
        .where('t.resolved', 'true')
        .join('users as u', 'u.id', '=', 't.author')
        .join('categories as c', 'c.id', '=', 't.category_id')
        .select(
            't.id as ticket_id',
            't.title',
            't.content',
            't.posted_time',
            'u.username as author',
            't.resolved',
            't.resolved_by',
            't.resolved_time',
            'c.name as category'
        ),
    getUnresolvedTickets: () => db('tickets as t')
        .where('t.resolved', 'false')
        .join('users as u', 'u.id', '=', 't.author')
        .join('categories as c', 'c.id', '=', 't.category_id')
        .select(
            't.id as ticket_id',
            't.title',
            't.content',
            't.posted_time',
            'u.username as author',
            't.resolved',
            't.resolved_by',
            't.resolved_time',
            'c.name as category'
        ),
    getTicketsByAuthor: name => db('tickets as t')
        .where('u.username', name)
        .join('users as u', 'u.id', '=', 't.author')
        .join('categories as c', 'c.id', '=', 't.category_id')
        .select(
            't.id as ticket_id',
            't.title',
            't.content',
            't.posted_time',
            'u.username as author',
            't.resolved',
            't.resolved_by',
            't.resolved_time',
            'c.name as category'
        ),
    addTicket: ticket => db('tickets').insert(ticket),
    updateTicket: (id, update) => db('tickets').where({ id }).update(update),
    removeTicket: id => db('tickets').where({ id }).del(),

    // -> Comment Functions
    getAllComments: () => db('comments as c')
        .join('users as u', 'u.id', '=', 'c.author')
        .select(
            'c.id as comment_id',
            'u.username as author',
            'c.message',
            'c.posted_time',
            'c.ticket_id as ticket_id'
        ),
    getCommentByID: id => db('comments as c')
        .where('c.id', id)
        .join('users as u', 'u.id', '=', 'c.author')
        .select(
            'c.id as comment_id',
            'u.username as author',
            'c.message',
            'c.posted_time',
            'c.ticket_id as ticket_id'
        ).first(),
    getCommentsByAuthor: name => db('comments as c')
        .where('u.username', name)
        .join('users as u', 'u.id', '=', 'c.author')
        .select(
            'c.id as comment_id',
            'u.username as author',
            'c.message',
            'c.posted_time',
            'c.ticket_id as ticket_id'
        ),
    getCommentsByTicketID: id => db('comments as c')
        .where('c.ticket_id', id)
        .join('users as u', 'u.id', '=', 'c.author')
        .select(
            'c.id as comment_id',
            'u.username as author',
            'c.message',
            'c.posted_time',
            'c.ticket_id as ticket_id'
    ),
    addComment: comment => db('comments').insert(comment),
    updateComment: (id, update) => db('comments').where({ id }).update(update),
    removeComment: id => db('comments').where({ id }).del(),

    // -> Role Functions
    getAllRoles: () => db('roles'),
    getRoleByID: id => db('roles').where({ id }),

    // -> Category Functions
    getAllCatgories: () => db('categories'),
    getCategoryByID: id => db('categories').where({ id }),
}