// -> Express Router
const server = require('express').Router();

server.post('/devdesk', (req, res) => {
    console.log(req);
})

module.exports = server;