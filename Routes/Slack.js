// -> Express Router
const server = require('express').Router();

server.post('/devdesk', (req, res) => {
    console.log(req.body);
    res.status(200).send('Got the request.');
})

module.exports = server;