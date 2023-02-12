const Sequelize = require('@sequelize/core');
const database = require('../database');

const Exercise = database.define('exercise', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
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
        allowNull: true
    }
})

module.exports = Exercise;

export {}
