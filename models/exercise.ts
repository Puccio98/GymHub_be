const Sequelize = require('@sequelize/core');
const database = require('../database');

const Exercise = database.define('exercise', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    schedaId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    day: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    subtitle: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
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

module.exports = Exercise;

export {}
