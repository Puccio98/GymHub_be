const Sequelize = require('@sequelize/core');
const database = require('../database');

const Exercise = database.define('Exercise', {
    ExerciseID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    Title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Subtitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Description: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports = Exercise;

export {}
