const mysql = require('mysql');
const config = require('config');
const {WordNotFound} = require("./words.errors");

// ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password'

// This is the entry class to my db, I chose mysql for the simplicity + when handling a very
// structured and flat data I think it make sense to go with a RDS.
// If the feature had larger entities with multiple and changing fields I would
// probably go with a none RDS, like mongo (because I used it in the past)

// In this class I connect to the db, create the tables I need AND insert / update / query the data,
// which is a bit too much. I would separate the above into different files / classes, each
// handling a single responsibility.

// I saw a library called typeorm which seems awesome but I saw it as part of a larger project I decided
// not to use, I will explain why in the email

class WordsRepository {
    connectToDb() {
        this.connection = mysql.createConnection(config.get('WordsDbConnection'));

        return new Promise(((resolve, reject) => {
            this.connection.connect(function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }))
    }

    async getWordCount(word) {
        return new Promise(((resolve, reject) => {
            const sql = `SELECT appearance_count FROM words WHERE word = ?`;

            this.connection.query(sql, [word], (error, results, fields) => {
                if (error) {
                    reject(error)
                } else {
                    if (results[0]) {
                        resolve(results[0].appearance_count)
                    } else {
                        reject(new WordNotFound(word))
                    }

                }
            });
        }))
    }

    async addWords(words) {
        const wordsAndAppearanceCount = [];
        Object.keys(words).forEach(word => wordsAndAppearanceCount.push([word, words[word]]));
        return new Promise((resolve, reject) => {
            const sql = `
            INSERT INTO words (word, appearance_count) VALUES ? AS new(word, appearance_count)
            ON DUPLICATE KEY UPDATE
            words.appearance_count = new.appearance_count + words.appearance_count;`;

            const query = this.connection.query(sql, [wordsAndAppearanceCount], (error, results, fields) => {
                if (error) {
                    reject(error)
                } else {
                    resolve({results, fields})
                }
            });
        })
    }

    async setup() {
        await this.connectToDb();
        await this.createWordsTableIfNeeded()
    }

    createWordsTableIfNeeded() {
        const query = `CREATE TABLE IF NOT EXISTS words (
            word VARCHAR(50) NOT NULL PRIMARY KEY,
            appearance_count INT
        )`;

        return new Promise(((resolve, reject) => {
            this.connection.query(query, undefined, (error, results, fields) => {
                if (error) {
                    reject(error)
                } else {
                    resolve({results, fields})
                }
            });
        }))
    }
}

module.exports = new WordsRepository();
