const fs = require('fs');

const Sequelize = require('@sequelize/core');

const key = fs.readFileSync('server.key');
const cert = fs.readFileSync('server.cert');

/**
 * Online DB
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
        }
    });

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
