const Sequelize = require('@sequelize/core');
const database = require('../database');

const Program = database.define('program', {
    ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    programStateID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 1
    },
    numberOfWorkout: {
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
