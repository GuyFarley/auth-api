'use strict';

require('dotenv').config();
const { sequelize } = require('./src/models');
const server = require('./src/server.js');

sequelize.sync().then(() => {
  console.log('successfully connected to database!');
  server.start();
});
