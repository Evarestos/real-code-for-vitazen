jest.mock('winston');
const cacheService = require('../services/cacheService');
const Redis = require('ioredis-mock');

jest.mock('ioredis', () => require('ioredis-mock'));

describe('Cache Service', () => {
  let redisClient;

  beforeEach(() => {
    redisClient = new Redis();
    redisClient.flushall();
  });

  test('should set and get cached value', async () => {
    const key = 'testKey';
    const value = { data: 'testData' };

    await cacheService.getOrSet(key, () => value);
    const cachedValue = await cacheService.getOrSet(key, () => null);

    expect(cachedValue).toEqual(value);
  });

  test('should invalidate cached value', async () => {
    const key = 'testKey';
    const value = { data: 'testData' };

    await cacheService.getOrSet(key, () => value);
    await cacheService.invalidate(key);
    const cachedValue = await cacheService.getOrSet(key, () => null);

    expect(cachedValue).toBeNull();
  });

  test('should clear entire cache', async () => {
    const key1 = 'testKey1';
    const key2 = 'testKey2';
    const value = { data: 'testData' };

    await cacheService.getOrSet(key1, () => value);
    await cacheService.getOrSet(key2, () => value);
    await cacheService.clearCache();

    const cachedValue1 = await cacheService.getOrSet(key1, () => null);
    const cachedValue2 = await cacheService.getOrSet(key2, () => null);

    expect(cachedValue1).toBeNull();
    expect(cachedValue2).toBeNull();
  });
});
