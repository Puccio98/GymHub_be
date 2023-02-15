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

export interface ExerciseWorkoutItem {
    Exercise_WorkoutID?: number,
    WorkoutID: number,
    ExerciseID: number,
    Set: number,
    Rep: number,
    Weight: number,
    RPE?: number,
    RM?: number,
    Percentage?: number
}

module.exports = ExerciseWorkout;

export {}
