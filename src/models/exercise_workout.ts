const Sequelize = require('@sequelize/core');
const database = require('../database');

// Nomenclatura tabelle di cross: Nome delle tabelle suddivise da underscore
const ExerciseWorkout = database.define('Exercises_Workout', {
    Exercise_WorkoutID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    WorkoutID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ExerciseID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Set: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Rep: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Weight: {
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
    Percentage: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
})

module.exports = ExerciseWorkout;

export {}
