const Sequelize = require('@sequelize/core');
const database = require('../database');

const Workout = database.define('Workout', {
    WorkoutID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    ProgramID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    IsDone: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false
    }
})

export interface Workout {
    WorkoutID?: number,
    ProgramID: number,
    IsDone: boolean
}

module.exports = Workout;

export {}
