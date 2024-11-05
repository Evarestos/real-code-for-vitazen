require('dotenv').config({ path: '.env.test' });

jest.mock('winston');

jest.mock('prom-client', () => ({
  collectDefaultMetrics: jest.fn(),
  register: {
    metrics: jest.fn().mockResolvedValue('metrics'),
    contentType: 'text/plain',
  },
  Counter: jest.fn().mockImplementation(() => ({
    inc: jest.fn(),
  })),
  Histogram: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
  })),
}));

jest.mock('../services/redisService', () => ({
  initRedis: jest.fn(),
  getRedisClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(),
    on: jest.fn(),
    set: jest.fn().mockResolvedValue(),
    get: jest.fn().mockResolvedValue()
  }))
}));

jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(),
    on: jest.fn(),
    set: jest.fn().mockResolvedValue(),
    get: jest.fn().mockResolvedValue()
  }))
}));

jest.mock('axios');
const axios = require('axios');
axios.post.mockResolvedValue({ data: { completion: 'Mocked wellness program' } });

afterAll(async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // wait for 500 ms
});
