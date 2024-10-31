require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
jest.mock('winston');
jest.mock('../services/redisService');
jest.mock('redis');
const redis = require('redis');

const mockRedisClient = {
  get: jest.fn(),
  set: jest.fn(),
  connect: jest.fn(),
  on: jest.fn()
};

const { getRedisClient } = require('../services/redisService');
getRedisClient.mockReturnValue(mockRedisClient);

function simulateRedisFailure() {
  mockRedisClient.get.mockRejectedValue(new Error('Redis connection failed'));
  mockRedisClient.set.mockRejectedValue(new Error('Redis connection failed'));
}

function simulateRedisRecovery() {
  mockRedisClient.get.mockResolvedValue(JSON.stringify({ key: 'value' }));
  mockRedisClient.set.mockResolvedValue('OK');
}

let token;

beforeAll(async () => {
  await User.deleteMany();
  const user = await User.create({
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser'
  });
  token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
});

describe('App Reliability', () => {
  test('should handle Redis connection failure gracefully', async () => {
    simulateRedisFailure();

    const response = await request(app)
      .get('/api/programs')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(200);
  });

  test('should maintain session across requests', async () => {
    simulateRedisRecovery();
    
    const agent = request.agent(app);
    
    // Login
    await agent
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200);

    // Access protected route
    const response = await agent.get('/api/programs');
    expect(response.statusCode).toBe(200);
  });

  test('should handle Redis unavailability gracefully', async () => {
    simulateRedisFailure();

    const response = await request(app)
      .get('/api/programs/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    // The app should still function, but without caching
  });

  test('should handle Redis recovery gracefully', async () => {
    simulateRedisFailure();

    // First request should fail to use cache
    let response = await request(app)
      .get('/api/programs/1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(mockRedisClient.get).toHaveBeenCalledTimes(1);

    simulateRedisRecovery();

    // Second request should successfully use cache
    response = await request(app)
      .get('/api/programs/1')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(mockRedisClient.get).toHaveBeenCalledTimes(2);
    expect(mockRedisClient.set).toHaveBeenCalledTimes(1);
  });
});
