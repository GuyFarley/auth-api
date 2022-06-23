'use strict';

const { db } = require('./src/auth/models/index.js');
const server = require('./src/server.js');

db.sync().then(() => {
  server.start(process.env.PORT || 3002);
});
