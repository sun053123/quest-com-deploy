import HTTPConstant from "./HTTPConstant";

class AppError extends Error {
    constructor(name,statusCode,description, isOperational, errorStack, logingErrorResponse){
        super(description);
        Object.setPrototypeOf(this,new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational
        this.errorStack = errorStack;
        this.logError = logingErrorResponse;
        Error.captureStackTrace(this);
    }
}

//Handle server error
class APIError extends AppError {
    constructor(name,statusCode,description, isOperational, errorStack, logingErrorResponse){
        super(name,statusCode,description, isOperational, errorStack, logingErrorResponse);
        Object.setPrototypeOf(this,new.target.prototype);
    }
}

// statusCode: 403 = Forbidden
class UnauthorizedError extends AppError {
    constructor(name,statusCode,description, isOperational, errorStack, logingErrorResponse){
        super(name,statusCode,description, isOperational, errorStack, logingErrorResponse);
        Object.setPrototypeOf(this,new.target.prototype);
    }
}

module.exports = {
    AppError,
    APIError,
    UnauthorizedError
}