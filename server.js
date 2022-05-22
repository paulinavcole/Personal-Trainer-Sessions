const express = require('express');
const app = express();
const {setupDB, Client, Instructor, Session} = require('./db');

app.use('/assets', express.static('assets'))

app.get('/', async(req, res, next) => {
    try {
        const[clients, instructors, sessions] = await Promise.all([
            Client.findAll(),
            Instructor.findAll(),
            Session.findAll({
                include: [Client, Instructor]
            })
        ]);
        res.send(`
        <html>
            <head>
                <title>Fitclub Personal Trainer Sessions</title>
                <link rel='stylesheet' href='/assets/styles.css'/>
            </head>
            <body>
                <header> <img src='https://c.tenor.com/i2i-RW59w70AAAAC/gym-pusheen.gif'/> FitClub Personal Training Sessions</header>
                <h2>Clients</h2>
                <ul>
                ${
                    clients.map(client => {
                        return `
                        <li>${client.name}</li>
                    `;
                    }).join('')
                }
                </ul>
                <h2>Trainers</h2>
                <ul>
                ${
                    instructors.map(instructor => {
                        return `
                        <li>${instructor.name}</li>
                        `;
                    }).join('')
                }
                </ul>
                <h2>Currently Booked Sessions</h2>
                <ul>
                ${
                    sessions.map(session => {
                        return `
                        <li>
                        ${session.client.name} trains with ${session.instructor.name} on ${session.sessionDate}
                        </li>
                        `;
                    }).join('')
                }
                </ul>
                <form method='POST' action='/sessions'>
                    <select name='clientID'>
                    ${
                        clients.map (client => {
                            return `
                            <option value='${client.id}'>
                            ${client.name}
                            </option>
                            `;
                        }).join('')
                    }
                    </select>
                    <select name='instructor.id'>
                    ${
                        instructors.map(instructor => {
                            return `
                            <option value='${instructor.id}'>
                                ${instructor.name}
                            </option>
                            `;
                        }).join('')
                    }
                    </select>
                    <input name='sessionDate' />
                    <button>Book New Session</button>
                </form>
            </body>
        </html>
    `)
    }
    catch(ex) {
        next(ex);
    }
});

const init = async() => {
    try {
        await setupDB();
        console.log('database is set up')
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`listening on port ${port}`));
    }
    catch(ex) {
        console.log(ex)
    }
};

init();