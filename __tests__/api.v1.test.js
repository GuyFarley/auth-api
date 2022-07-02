'use strict';

const { server } = require('../src/server');
const { sequelize } = require('../src/models');
const supertest = require('supertest');
const mockRequest = supertest(server);

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.drop();
});

describe('Web Server Tests', () => {

  test('404 on a bad route', async () => {
    let response = await mockRequest.get('/api/v1/foo');
    console.log(response.status);
    expect(response.status).toEqual(404);
  });

  test('Successfully creates a record', async () => {
    const data = {
      name: 'crackers',
      calories: 145,
      type: 'snack',
    };

    const response = await mockRequest.post('/api/v1/food').send(data);
    expect(response.status).toBe(201);

    expect(response.body.id).toBeDefined();

    Object.keys(data).forEach(key => {
      expect(response.body[key]).toEqual(data[key]);
    });
  });

  test('Can get one record', async () => {
    const response = await mockRequest.get('/api/v1/food/1');

    expect(response.status).toBe(200);
    expect(typeof response.body).toEqual('object');
    expect(response.body.id).toEqual(1);
  });

  test('Can get a list of all records', async () => {
    const response = await mockRequest.get('/api/v1/food');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toEqual(1);
  });

  test('Can update a record', async () => {
    const data = { name: 'cupcakes' };
    const response = await (await mockRequest.put('/api/v1/food/1').send(data));

    expect(response.status).toBe(200);
    expect(typeof response.body).toEqual('object');
    expect(response.body.id).toEqual(1);
    expect(response.body.name).toEqual('cupcakes');
  });

  test('Can delete a record', async () => {
    const response = await mockRequest.delete('/api/v1/food/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(1);

    const getResponse = await mockRequest.get('/api/v1/food');
    expect(getResponse.body.length).toEqual(0);
  })

})