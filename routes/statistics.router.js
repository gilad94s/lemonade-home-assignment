const express = require('express');
const wordsService = require('../words/words.service');
const router = express.Router();

// I decided to do a function for word-count because this is the fastest way to do it right now.
// If the requirement was to be able to query on more information I would have probably use graphql
// for it's query language and mysql easy connection

// try / catch is kind of redundant, there should be a wrapper for catching automatically and
// calling next()
router.get('/word-count', async function (req, res, next) {
    const word = req.query.word;
    try {
        const count = await wordsService.getWordCount(word);
        return res.json({count});
    } catch (e) {
        next(e)
    }
});

module.exports = router;
