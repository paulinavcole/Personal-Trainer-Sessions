const express = require('express');
const app = express();
const {setupDB, Client, Instructor, Session} = require('./db');

app.use('/assets', express.static('assets'));
app.use(express.urlencoded({extended:false}));
app.use(require('method-override')('_method'))

app.delete('/sessions/:id', async(req, res, next) =>{
    try {
        const session = await Session.findByPk(req.params.id);
        await session.destroy();
        res.redirect('/');
    }
    catch(ex) {
        next(ex)
    }
});

app.put('/sessions/:id', async (req, res, next) => {
    try { Session.update(
        {sessionDate: req.body.sessionDate}, 
        {returning: true, where: {id: req.params.id}})
        res.redirect('/')
    }
    catch(ex) {
        next(ex)
    }
})


app.post('/sessions', async(req, res, next) => {
    try {
        await Session.create(req.body);
        res.redirect('/')
    }
    catch(ex) {
        next(ex)
    }
});


app.post('/clients', async(req, res, next) => {
    try {
        await Client.create(req.body);
        res.redirect('/')
    }
    catch (ex) {
        if (ex.name === 'SequelizeUniqueConstraintError') {
            res.status(403)
            res.send({ status: 'error', message: "User already exists"});
        } else {
            res.status(500)
            res.send({ status: 'error', message: "Something went wrong"});
        }
    }   
});

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
                <main>
                    <header> <img src='https://c.tenor.com/i2i-RW59w70AAAAC/gym-pusheen.gif'/> FitClub Personal Training Sessions</header>
                    <h2>Clients</h2>
                    <ul>
                    ${
                        clients.map(client => {
                            return `
                            <li>${client.name}
                            </li>
                        `;
                        }).join('')
                    }
                    <form method='POST' action='/clients'>
                        <input name='name' />
                        <button>Add a client!</button>
                    </form>
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
                            <form method='POST' action='/sessions/${session.id}?_method=DELETE'>
                                <button>Remove</button>
                            </form>
                            <form method='POST' action='/sessions/${session.id}?_method=PUT'>
                                <input name='sessionDate' />
                                <button>Update Date of Session</button>
                            </form>
                            </li>
                            `;
                        }).join('')
                    }
                    </ul>
                    <div class='sessions'>
                        <form method='POST' action='/sessions'>
                            <select name='clientId'>
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
                            <select name='instructorId'>
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
                    </div>
                </main>
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