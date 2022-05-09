const express = require('express');
const expressApp = require('./express.app');
const { DatabaseConnect } = require('./database');
const gracefulShutdown = require('./utils/gracefulShutdown');
const dotenv = require('dotenv');

dotenv.config();

const StartServer = async() => {

    const app = express();

    await DatabaseConnect()

    await expressApp(app);

    const server = gracefulShutdown(app);

    server.listen(process.env.PORT || 8000, () => {
        console.log(`Server listening on http://localhost:${process.env.PORT}`);
    }).on('error', (err) => {
        console.log(err);
        process.exit();
    }).on('listening', () => {
        console.log(`Sever is Running ...`);
    }).on('close', () => {
        console.log('Server closed');
    });

    process.on('SIGINT', () => {
        server.close(() => {
            console.log('Server closed on app interruption!');
            process.exit(0);
        });
    }, 'SIGTERM', () => {
        server.close(() => {
            console.log('Server closed on app termination!');
            process.exit(0);
        });
    });
}


StartServer();