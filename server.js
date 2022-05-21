const express = require('express');
const app = express();
const {setupDB, Client, Instructor, Session} = require('./db');

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