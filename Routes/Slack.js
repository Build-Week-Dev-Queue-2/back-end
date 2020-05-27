// -> Express Router
const server = require('express').Router();

// -> DB Helper
const db = require('../data/db-helper');

server.post('/devdesk', async (req, res) => {
    const { text, user_id } = req.body;
    // -> /devdesk [connect] [username -p password]
    // -> /devdesk connect -u username -p password
    // Check if user_id is valid.
    const userExists = await db.getUserBySlackID(user_id);
    if (!userExists) {
        // Check to see if they were trying to connect. Else, send error message.
        const textSplitSpaces = text.trim().split(' ');
        if (textSplitSpaces[0].toLowerCase() === 'connect') {
            if (!text.toLowerCase().includes('-u') || !text.toLowerCase().includes('-p')) return res.status(200).send(`Oops! Please provide a '-u [username]' and '-p [password]' to connect.`); 
            const   username = text.split(' -u ')[1].split(' -p ')[0],
                password = text.split(' -u ')[1].split(' -p ')[1];
            console.log(username, password);
            return res.sendStatus(200);
        } else return res.status(200).send(`Oops! Your slack account isn't connected. Type /devdesk connect -u [username] -p [password] to connect.`);
    }

    res.sendStatus(200);
})

module.exports = server;