const fs = require('fs');

const Sequelize = require('@sequelize/core');

const key = fs.readFileSync('server.key');
const cert = fs.readFileSync('server.cert');

/**
 * Online DB
 */
const database = new Sequelize(
    'gymhub_test',
    'crs8jhzmow74jsmpf3ga',
    'pscale_pw_AjuzO3Pdsi2jTdtcS6TTZXmpx8tVTcqNb1AcpIq4ZQB',
    {
        dialect: 'mysql', host: 'eu-central.connect.psdb.cloud', dialectOptions: {
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
