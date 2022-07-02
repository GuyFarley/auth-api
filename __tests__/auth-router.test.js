'use strict';

const supertest = require('supertest');
const server = require('../src/server.js').server;
const { sequelize } = require('../src/models');
const mockRequest = supertest(server);

let users = {
  admin: { username: 'admin', password: 'password', role: 'admin' },
  editor: { username: 'editor', password: 'password', role: 'editor' },
  user: { username: 'user', password: 'password', role: 'user' },
};

beforeAll(async () => {
  await sequelize.sync();

});
afterAll(async () => {
  await sequelize.drop();

});

describe('Auth Router Tests', () => {

  Object.keys(users).forEach(userType => {

    describe(`${userType} users`, () => {
      test('Creates one', async () => {
        const response = await mockRequest.post('/signup').send(users[userType]);
        const userObject = response.body;

        expect(response.status).toBe(201);
        expect(userObject.token).toBeDefined();
        expect(userObject.user.id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username);
      });

      test('Can sign in with basic auth', async () => {
        const response = await mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password);

        const userObject = response.body;
        expect(response.status).toBe(200);
        expect(userObject.token).toBeDefined();
        expect(userObject.user.id).toBeDefined();
        expect(userObject.user.username).toEqual(users[userType].username);
      })

      test('Can sign in with bearer auth', async () => {
        const response = await mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password);

        const token = response.body.token;

        const bearerResponse = await mockRequest
          .get('/users')
          .set('Authorization', `Bearer ${token}`);

        expect(bearerResponse.status).toBe(200);
      })
    });

    describe('Bad logins', () => {
      test('Basic auth fails with known user and wrong password', async () => {

        const response = await mockRequest.post('/signin')
          .auth('admin', 'xyz');
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();
      });

      test('Basic auth fails with uknown user', async () => {

        const response = await mockRequest.post('/signin')
          .auth('nobody', 'xyz');
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();
      });

      test('Hits "/secret" route', async () => {

        const tokenResponse = await mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password);

        const token = tokenResponse.body.token;

        const response = await mockRequest
          .get('/secret')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Welcome to the secret area');
      });
    });
  });
});




