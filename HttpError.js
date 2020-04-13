// the basic http error
// should also have a "to json" method for parsing
class HttpError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = HttpError;
