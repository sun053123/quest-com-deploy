const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

module.exports = async() => {

    const connect = () => {
        mongoose.connect(process.env.DB_URL).then(() => {
            console.log('MongoDB connected...');
        }).catch(err => {
            console.error(err);
            process.exit(1);
        }
        );
    }

    connect();

    mongoose.connection.on('error', err => {
        console.error(err);
        process.exit(1);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected...');
        connect();
    });

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose disconnected on app interruption');
            process.exit(0);
        });
    });

    process.on('SIGTERM', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose disconnected on app termination');
            process.exit(0);
        });
    });

};



