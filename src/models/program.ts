const Sequelize = require('@sequelize/core');
const database = require('../database');

const Program = database.define('Program', {
    ProgramID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    UserID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    ProgramStateID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 1
    },
    NumberOfWorkout: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            min: 1,                  // only allow values >= 1
            max: 7                  // only allow values <= 7
        }
    }
})

module.exports = Program;

export {}
