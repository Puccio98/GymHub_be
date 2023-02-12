const Sequelize = require('@sequelize/core');
const database = require('../database');

const ProgramState = database.define('programState', {
    ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = ProgramState;

export {}
