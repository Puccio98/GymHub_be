const Sequelize = require('@sequelize/core');
const database = require('../database');

const Scheda = database.define({
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    creatorId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = Scheda;

export {}
