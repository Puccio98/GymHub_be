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

export interface ExerciseItem {
    /**
     * Id in inserimento è un campo nullo.
     */
    ExerciseID?: number,
    Title: string,
    Subtitle: string,
    Description?: string
}

module.exports = Exercise;

export {}
