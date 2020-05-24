// -> Express
const express = require('express');
const server = express();

// -> Environment Variables
require('dotenv').config()

server.use(express.json());

// -> Routes
server.use('/api/users', require('./Routes/Users'));
server.use('/auth', require('./Routes/Auth'));

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`API started on port ${port}.`));  