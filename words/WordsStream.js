const WordsRepo = require('./words.repo');
const WritableStream = require('stream').Writable;
const config = require('config');
const {StreamWordsToDbError} = require("./words.errors");

// This is just a stream to the db, it gets a stream of words and passes it to the db.
// I was considering dividing the bit into two pieces, one for the actual word separation
// and the other of the writing to the db.
// For now, I decided this is enough

// Also, take in mind I hadn't had the chance to implement a stream before, so there are probably stuff I
// should have done but didn't (like firing some event at the end or something)
// If the were a real feature I would have consulted someone who worked with
// this before or do more research

// todo: handle db error
class WordsStream extends WritableStream {
    constructor() {
        super();
        this.lastChunksWord = '';
        this.charactersRead = 0;
    }

    _write(chunk, enc, next) {
        const strChunk = chunk.toString();
        this.handleChunk(strChunk)
            .then(() => next())
            .catch(err => next(err))
    }

    _final(cb) {
        this.addLastWord()
            .then(() => cb())
            .catch(err => cb(err));
    }

    // this should not exists really, it should be within the "handle chunk" but I
    // needed to do a bit more resource on how to know when the stream ended on the "data" event
    async addLastWord() {
        const wordsCounter = {[this.lastChunksWord]: 1};
        return WordsRepo.addWords(wordsCounter);
    }

    async handleChunk(chunk) {
        chunk = this.lastChunksWord + chunk.toLowerCase();
        const regexp = RegExp(config.get('wordsSeparator'), 'g');
        const words = chunk.split(regexp).filter(word => word !== '');
        this.lastChunksWord = words.pop();

        if (!words.length) {
            return;
        }

        const wordsCounter = {};

        words.forEach(word => {
            if (wordsCounter[word]) {
                wordsCounter[word] += 1;
            } else {
                wordsCounter[word] = 1;
            }
        });
        try {
            return WordsRepo.addWords(wordsCounter);
        } catch (e) {
            throw new StreamWordsToDbError(this.charactersRead);
        } finally {
            this.charactersRead += chunk.length;
        }
    }
}

module.exports = WordsStream;
