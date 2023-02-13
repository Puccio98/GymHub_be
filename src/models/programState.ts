const Sequelize = require('@sequelize/core');
const database = require('../database');

const ProgramState = database.define('ProgramState', {
    ProgramStateID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    State: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = ProgramState;

export {}
