const { createLogger, format, transports } = require('winston');
const { FormateData } = require('.');
const { AppError } = require('.');

const loggerError = createLogger({
    transports: [
        new transports.Console({
            level: 'error',
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.printf(err => `error : ${err.message}`)
            ),
        }),
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: format.combine(
                format.colorize(),
                format.timestamp(),
                format.printf(err => `error : ${err.message}`)
            )
        })
    ]
});

class ErrorLogger {
    constructor() {}
    async logError(err){
        console.log('==================== Start Error Logger ===============');
        loggerError.log({
            private: true,
            level: 'error',
            message: `${new Date()}-${JSON.stringify(err.TypeOfError)}: ${JSON.stringify(err.message)}`,
          });
        console.log('==================== End Error Logger ===============');
        // log error with Logger plugins
        return false;
    }

    async logErrorWithMessage(message) {
        console.log('==================== Start Error Logger ===============');
        loggerError.log({
            private: true,
            level: 'error',
            message: `${new Date()}-${message}`,
          });
        console.log('==================== End Error Logger ===============');
        // log error with Logger plugins
        return false;
    }

    isTrustError(err) {
        if(error instanceof AppError){ 
            return err.isOperational;
        }else{
            return false;
        }
    }
}

const HandleErrors = async (err, req, res, next) => {
    const errorLogger = new ErrorLogger();


    process.on('unhandledRejection', (reason, p) => {
        console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        // application specific logging, throwing an error, or other logic here
        process.exit(1);
    })

    process.on('uncaughtException', (err) => {
        errorLogger.logError(err);
        process.exit(1);
    })

    if(err){
        errorLogger.logError(err);
        if(errorLogger.isTrustError(err)){
            return res.status(500).json(
                FormateData({
                    status: 500,
                    message: "Server error",
                    error : [
                        {
                            message: error.message,
                        }
                    ]
                })
            );
            
        }
    }
    next();
}

module.exports = HandleErrors;

    