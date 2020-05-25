// -> Express
const express = require('express');
const server = express();

server.use(express.json());

server.get('/', (req, res) => { 
    res.status(200).json({
        message: "Welcome to DevDeskQueue Backend!",
    })
});

// -> Routes
server.use('/api/users', require('./Routes/Users'));
server.use('/api/tickets', require('./Routes/Tickets'));
server.use('/auth', require('./Routes/Auth'));

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`API started on port ${port}.`));  
