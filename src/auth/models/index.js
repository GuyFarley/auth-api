'use strict';

require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const userModel = require('./users.js');


const DATABASE_URL = 'test' ? 'sqlite::memory' : 'sqlite:memory';

const DATABASE_CONFIG = process.env.NODE_ENV === 'production' ? {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
} : {};

const sequelize = new Sequelize(DATABASE_URL, DATABASE_CONFIG);

module.exports = {
  db: sequelize,
  users: userModel(sequelize, DataTypes),
};
