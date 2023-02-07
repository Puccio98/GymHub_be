const Sequelize = require('@sequelize/core');

const database = new Sequelize('GymHub_Test', 'root', 'Alessandro12', {dialect: 'mysql', host: 'localhost'});

module.exports = database;


export {}
