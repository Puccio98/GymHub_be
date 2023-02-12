const Sequelize = require('@sequelize/core');
const database = require('../database');

const User = database.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false
    },
    region: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cap: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    profilePicture: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

export interface UserItem {
    /**
     * Id in inserimento è un campo nullo.
     */
    id?: number,
    name: string,
    lastName: string,
    email: string,
    password: string,
    phoneNumber: number,
    country: string,
    region: string,
    city: string,
    address: string,
    cap: number,
    profilePicture?: string
}

module.exports = User;

export {}
