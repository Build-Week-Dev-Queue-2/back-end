// -> Express
const express = require('express');
const server = express();

// -> CORS
const cors = require('cors');

// -> Body Parsing
const bp = require('body-parser');

if(!process.env.ENV) {require('dotenv').config()}

server.use(cors());
server.use(bp.json());
server.use(bp.urlencoded({
    extended: true,
}))

server.get('/', (req, res) => { 
    res.status(200).json({
        message: "Welcome to DevDeskQueue Backend!",
    })
});

// -> Routes
server.use('/api/users', require('./Routes/Users'));
server.use('/api/tickets', require('./Routes/Tickets'));
server.use('/api/comments', require('./Routes/Comments'));
server.use('/slack', require('./Routes/Slack'));
server.use('/auth', require('./Routes/Auth'));

const port = process.env.PORT || 5000;
module.exports = server.listen(port, () => console.log(`API started on port ${port}.`));  
