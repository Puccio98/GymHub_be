const Sequelize = require('@sequelize/core');
const database = require('../database');

const Workout = database.define('workout', {
    ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    programID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    isDone: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false
    }
})

module.exports = Workout;

export {}
