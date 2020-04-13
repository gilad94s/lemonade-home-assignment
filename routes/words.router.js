const express = require('express');
const wordsService = require('../words/words.service');
const router = express.Router();

// this is the 'router' layer, no logic here, just extracting the request options from
// the actual http request and passing it to the 'service' layer to handle the logic
router.post('/', async function (req, res, next) {
    let stream = undefined;

    // I was considering to create some sort of enum for the 'FILE_PATH' and 'URL'
    // but at this point I think that this is much more readable, no need to go to
    // a different file to check exactly how to write it in the request
    // plus, If I were to use swagger this would be in the swagger definition giving clarity
    // and a single source of truth

    // try / catch is kind of redundant, there should be a wrapper for catching automatically and
    // calling next()
    try {
        switch (req.headers['x-request-type']) {
            case('FILE_PATH'): {
                stream = await wordsService.handleFilePathStream(req);
                break;
            }
            case('URL'): {
                stream = await wordsService.handleUrlStream(req);
                break;
            }
            default: {
                stream = await wordsService.handleWordStream(req);
            }
        }

        stream.on('finish', () => res.end())
            .on('error', err => next(err))
    } catch (err) {
        next(err)
    }

});

module.exports = router;
