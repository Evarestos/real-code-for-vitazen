const cache = new Map();

const cacheService = {
  getOrSet: async (key, callback) => {
    if (cache.has(key)) {
      return cache.get(key);
    }
    const value = await callback();
    cache.set(key, value);
    return value;
  },
  del: (key) => {
    cache.delete(key);
  },
  flush: () => {
    cache.clear();
  }
};

module.exports = cacheService;