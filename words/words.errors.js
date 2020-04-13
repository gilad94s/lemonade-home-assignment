const HttpError = require('../HttpError');

// Just some example http errors, In theory each scenario should have it's own error but for
// time saving purpose I decided to give an example of what I do with errors

class WordNotFound extends HttpError {
    constructor(word) {
        super(`The word '${word}' was not found.`, 404);
    }
}

class StreamWordsToDbError extends HttpError {
    constructor(charactersCount) {
        super(`There was a problem streaming the words to the db. So far ${charactersCount} characters were read`, 500);
        this.charactersCount = charactersCount;
    }
}

class FileNotFound extends HttpError {
    constructor(path) {
        super(`File not found in path ${path}.`, 404);
    }
}

module.exports = {
    WordNotFound, StreamWordsToDbError, FileNotFound
};

