const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('config');

const WordsRepo = require('./words/words.repo');
const indexRouter = require('./routes/index');
const wordsRouter = require('./routes/words.router');
const statisticsRouter = require('./routes/statistics.router');

async function setupDb(){
    await WordsRepo.setup();
}

const app = express();

app.use(logger(config.get('expressLoggerFormat')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/words', wordsRouter);
app.use('/statistics', statisticsRouter);

// should be elsewhere
// should handle error for Prod and Dev differently
// could be a lot more useful
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json(err)
});
setupDb().then(() => app.emit('ready'));

module.exports = app;
