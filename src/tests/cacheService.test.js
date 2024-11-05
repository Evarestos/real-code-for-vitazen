const { getOrSet, invalidate, clearCache } = require('../services/cacheService');
const Redis = require('ioredis');

jest.mock('ioredis');
jest.mock('../utils/logger');

describe('Cache Service', () => {
  let mockRedisClient;

  beforeEach(() => {
    mockRedisClient = {
      get: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
      keys: jest.fn(),
      flushall: jest.fn()
    };
    Redis.mockImplementation(() => mockRedisClient);
  });

  describe('getOrSet', () => {
    test('should return cached value if exists', async () => {
      const cachedValue = JSON.stringify({ data: 'cached' });
      mockRedisClient.get.mockResolvedValue(cachedValue);

      const result = await getOrSet('testKey', () => ({ data: 'fresh' }));

      expect(result).toEqual({ data: 'cached' });
      expect(mockRedisClient.get).toHaveBeenCalledWith('testKey');
      expect(mockRedisClient.setex).not.toHaveBeenCalled();
    });

    test('should set and return fresh value if cache miss', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      const freshValue = { data: 'fresh' };

      const result = await getOrSet('testKey', () => freshValue);

      expect(result).toEqual(freshValue);
      expect(mockRedisClient.get).toHaveBeenCalledWith('testKey');
      expect(mockRedisClient.setex).toHaveBeenCalledWith('testKey', 3600, JSON.stringify(freshValue));
    });

    test('should handle errors and call callback', async () => {
      mockRedisClient.get.mockRejectedValue(new Error('Redis error'));
      const freshValue = { data: 'fresh' };

      const result = await getOrSet('testKey', () => freshValue);

      expect(result).toEqual(freshValue);
    });
  });

  describe('invalidate', () => {
    test('should delete cache for given key', async () => {
      await invalidate('testKey');

      expect(mockRedisClient.del).toHaveBeenCalledWith('testKey');
    });

    test('should handle errors during invalidation', async () => {
      mockRedisClient.del.mockRejectedValue(new Error('Redis error'));

      await invalidate('testKey');

      // Verify that the error is logged (you might need to adjust this based on your logger implementation)
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('clearCache', () => {
    test('should clear entire cache when no namespace is provided', async () => {
      await clearCache();

      expect(mockRedisClient.flushall).toHaveBeenCalled();
    });

    test('should clear cache for specific namespace', async () => {
      const mockKeys = ['namespace:key1', 'namespace:key2'];
      mockRedisClient.keys.mockResolvedValue(mockKeys);

      await clearCache('namespace');

      expect(mockRedisClient.keys).toHaveBeenCalledWith('namespace:*');
      expect(mockRedisClient.del).toHaveBeenCalledWith(mockKeys);
    });

    test('should handle errors during cache clearing', async () => {
      mockRedisClient.flushall.mockRejectedValue(new Error('Redis error'));

      await clearCache();

      // Verify that the error is logged (you might need to adjust this based on your logger implementation)
      expect(console.error).toHaveBeenCalled();
    });
  });
});
