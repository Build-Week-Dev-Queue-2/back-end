// -> Express Router
const server = require('express').Router();

// -> DB Helper
const db = require('../data/db-helper');

// -> BCrypt
const bc = require('bcryptjs');

/**
 * /devdesk connect -u Michael Scott -p TheOffice
 */

server.post('/devdesk', async (req, res) => {
    const text = req.body.text;
    const slack_id = req.body.user_id;
    // -> /devdesk [connect] [username -p password]
    // -> /devdesk connect -u username -p password
    // Check if user_id is valid.
    const userExists = await db.getUserBySlackID(slack_id);
    if (!userExists) {
        // Check to see if they were trying to connect. Else, send error message.
        const textSplitSpaces = text.trim().split(' ');
        if (textSplitSpaces[0].toLowerCase() === 'connect') {
            if (!text.toLowerCase().includes('-u') || !text.toLowerCase().includes('-p')) return res.status(200).send(`Oops! Please provide a '-u [username]' and '-p [password]' to connect.`); 
            const username = text.split(' -u ')[1].split(' -p ')[0], password = text.split(' -u ')[1].split(' -p ')[1];
            const user = await confirmCredentials(res, username, password);
            if (!user) return res.status(200).send('Something went wrong.');


            if (user.slack_id) return res.status(200).send('This user already has a SlackID, please contact an administrator to reset.');

            await db.updateUser(user.user_id, {
                slack_id,
            })

            return res.status(200).send(`We successfully connected your account!`);
        } else return res.status(200).send(`Oops! Your slack account isn't connected. Type /devdesk connect -u [username] -p [password] to connect.`);
    }

    res.sendStatus(200);
})

const confirmCredentials = async (res, u, p) => {
    const user = await db.getUserByName(u);
    if (!user) return res.status(200).send(`Oops! You entered invalid credentials.`);

    const correctPassword = await bc.compareSync(p, user.password);
    if (!correctPassword) return res.status(200).send('Oops! You entered invalid credentials.');

    return user;
}

module.exports = server;