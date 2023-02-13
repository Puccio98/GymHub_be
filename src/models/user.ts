const Sequelize = require('@sequelize/core');
const database = require('../database');

const User = database.define('User', {
    UserID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    LastName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    PhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Country: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Region: {
        type: Sequelize.STRING,
        allowNull: false
    },
    City: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Address: {
        type: Sequelize.STRING,
        allowNull: false
    },
    CAP: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    ProfilePicture: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

export interface UserItem {
    /**
     * Id in inserimento è un campo nullo.
     */
    UserID?: number,
    Name: string,
    LastName: string,
    Email: string,
    Password: string,
    PhoneNumber: string,
    Country: string,
    Region: string,
    City: string,
    Address: string,
    CAP: number,
    ProfilePicture?: string
}

module.exports = User;

export {}
