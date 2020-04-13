const WordsStream = require('./WordsStream');
const fs = require('fs');
const request = require('superagent');
const wordsRepo = require('./words.repo');
const {FileNotFound} = require("./words.errors");

// this is the 'service' layer, which holds the some of the business logic.
// from this layer downward, the layers do know 'know' that they are a part of an http service
// which means they will not have any http related options
// I do this separation in order to be able to use this code anywhere I want in the future,
// and not depend on the http request.
function handleWordStream(stream) {
    const wordsStream = new WordsStream();
    return stream.pipe(wordsStream);
}

async function handleFilePathStream(stream) {
    let filePath = await readTextFromStream(stream);

    const fileStream = fs.createReadStream(filePath);

    return new Promise(((resolve, reject) => {
        fileStream.on('error', err => {
            switch (err.code) {
                case 'ENOENT':{
                    reject(new FileNotFound(filePath));
                    break
                }
                default:
                    reject(err);
            }

        });

        fileStream.on('open', () => resolve(handleWordStream(fileStream)))
    }));
}

async function handleUrlStream(stream) {
    let url = await readTextFromStream(stream);
    return handleWordStream(request.get(url))
}

async function readTextFromStream(stream) {
    return new Promise(((resolve, reject) => {
        let text = '';

        // Should I handle encoding?
        stream.on('data', chunk => text += chunk.toString());
        stream.on('error', err => reject(err));
        stream.on('end', () => resolve(text));
    }))
}

async function getWordCount(word) {
    return wordsRepo.getWordCount(word);
}

module.exports = {
    handleUrlStream,
    handleFilePathStream,
    handleWordStream,
    getWordCount
};
