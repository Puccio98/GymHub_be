const fs = require('fs');

const Sequelize = require('@sequelize/core');

const key = fs.readFileSync('server.key');
const cert = fs.readFileSync('server.cert');

/**
 * Online DB
 *
 * Optional Parameters:
 *      Query ha true di default in modo tale che le query restituiscano un oggetto contenete solo i campi del record del DB.
 *      Può essere sovrascritto nella singola query attraverso raw: false.
 *      Nest a true dovrebbe ritornare i record associati ad un record sotto forma di oggetto. Non ne sono sicurissimo.
 */
const database = new Sequelize(
    process.env.DB_CONNECTION_NAME,
    process.env.DB_USER_NAME,
    process.env.DB_PASSWORD,
    {
        dialect: 'mysql', host: process.env.DB_HOST, dialectOptions: {
            ssl: {
                key: key,
                cert: cert
            }
        },
        query: {raw: true}
    },
);

/**
 * Local DB nel mio pc
 */
/*
const database = new Sequelize(
    'GymHub_Test',
    'root',
    'Alessandro12',
    {dialect: 'mysql', host: 'localhost'});
*/
module.exports = database;


export {}
