const express = require('express');
const expressApp = require('./express.app');
const { DatabaseConnect } = require('./database');
const dotenv = require('dotenv');

dotenv.config();

const StartServer = async() => {

    const app = express();

    await DatabaseConnect()

    await expressApp(app);

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server listening on http://localhost:${process.env.PORT}`);
    }).on('error', (err) => {
        console.log(err);
        process.exit();
    });
}

StartServer();