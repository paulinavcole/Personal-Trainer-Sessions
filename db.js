const Sequelize = require('sequelize');
const { STRING, INTEGER, DATE } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/clients_instructors_sessions');

const Client = conn.define('client', {
    name: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

const Instructor = conn.define('instructor', {
    name: {
        type: STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

const Session = conn.define('session', {
    clientId: {
        type: INTEGER,
        allowNull: false
    },
    instructorId: {
        type: INTEGER,
        allowNull: false
    },
    sessionDate : {
        type: DATE,
        allowNull:  false
    }
});

Session.belongsTo(Client);
Session.belongsTo(Instructor);

const setupDB = async() => {
    await conn.sync({force: true});
    const [gleb, catherine, karin, danielle, rahima, demetrius, rodney, melissa] = await Promise.all([
        Client.create({name: 'gleb'}),
        Client.create({name: 'catherine'}),
        Client.create({name: 'karin'}),
        Client.create({name: 'danielle'}),
        Instructor.create({name: 'rahima'}),
        Instructor.create({name: 'demetrius'}),
        Instructor.create({name: 'rodney'}),
        Instructor.create({name: 'melissa'}),
    ]);

    await Promise.all([
        Session.create({clientId: gleb.id, instructorId: rahima.id, sessionDate: '05/26/22'}),
        Session.create({clientId: catherine.id, instructorId: demetrius.id, sessionDate: '06/12/22'}),
        Session.create({clientId: karin.id, instructorId: rodney.id, sessionDate: '05/30/22'}),
        Session.create({clientId: danielle.id, instructorId: melissa.id, sessionDate: '05/29/22'})
    ]);
};

module.exports = {
    setupDB,
    Client,
    Instructor,
    Session
};