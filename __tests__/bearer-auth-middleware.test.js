'use strict';

const middleware = require('../src/middleware/bearer.js');
const { sequelize, users } = require('../src/models');
const jwt = require('jsonwebtoken');

let testUsers = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
};

beforeAll(async () => {
  await sequelize.sync();
  await users.create(testUsers.admin);
});
afterAll(async () => {
  await sequelize.drop();
});

describe('Auth Middleware Tests', () => {
  const req = {};
  const res = {};
  const next = jest.fn();

  describe('User authentication', () => {

    test('Fails login for an admin user with incorrect token', () => {
      req.headers = {
        authorization: `Bearer badToken`,
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalled();
        });
    });

    test('Logs in a user with a correct token', () => {

      const user = { username: 'admin' };
      const token = jwt.sign(user, process.env.SECRET || 'secretstring');

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
        });
    });
  });
});