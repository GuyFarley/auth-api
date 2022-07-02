
const loggerMiddleware = require('../src/middleware/logger');

describe('Logger Middleware Tests', () => {

  let consoleSpy;
  let req = {};
  let res = {};
  let next = jest.fn();

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('Properly logs some output', () => {
    loggerMiddleware(req, res, next);
    expect(consoleSpy).toHaveBeenCalled();
  });

  test('Properly moves to the next middleware', () => {
    loggerMiddleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });

});