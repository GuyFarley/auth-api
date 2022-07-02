'use strict';

const middleware = require('../src/middleware/basic');
const { sequelize, users } = require('../src/models');

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
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
  };
  const next = jest.fn();

  describe('User authentication', () => {
    test('Fails login for a user (admin) with incorrect basic creds', () => {
      req.headers = {
        authorization: 'Basic YWRtaW46Zm9v',
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).not.toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    test('Logs in admin user with the right creds', () => {
      req.headers = {
        authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
      };

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
        });
    });
  });

});