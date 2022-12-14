const Sequelize = require('sequelize');
const { STRING, INTEGER, DATEONLY } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_express_seq');

const Client = conn.define('client', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }
});

const Instructor = conn.define('instructor', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
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
        type: DATEONLY,
        allowNull:  false
    }
});

Session.belongsTo(Client);
Session.belongsTo(Instructor);

const setupDB = async() => {
    await conn.sync({force: true});
    const [gleb, catherine, karin, danielle, rahima, demetrius, rodney, melissa] = await Promise.all([
        Client.create({name: 'Gleb'}),
        Client.create({name: 'Catherine'}),
        Client.create({name: 'Karin'}),
        Client.create({name: 'Danielle'}),
        Instructor.create({name: 'Rahima'}),
        Instructor.create({name: 'Demetrius'}),
        Instructor.create({name: 'Rodney'}),
        Instructor.create({name: 'Melissa'}),
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