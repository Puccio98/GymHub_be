const Sequelize = require('@sequelize/core');
const database = require('../database');

const ExerciseWorkout = database.define('exercise_workout', {
    ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    workoutID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    exerciseID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    set: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    weight: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    rep: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    RPE: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    RM: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    percentage: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
})

module.exports = ExerciseWorkout;

export {}
