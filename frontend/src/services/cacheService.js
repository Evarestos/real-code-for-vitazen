const CACHE_KEY = 'suggestions_cache';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 ώρες σε milliseconds

const cacheService = {
  getSuggestions: (input) => {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const now = new Date().getTime();

    // Καθαρισμός ληγμένων εγγραφών
    Object.keys(cache).forEach(key => {
      if (now > cache[key].expiration) {
        delete cache[key];
      }
    });

    // Αποθήκευση του ενημερωμένου cache
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

    return cache[input]?.suggestions || null;
  },

  setSuggestions: (input, suggestions) => {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const now = new Date().getTime();

    cache[input] = {
      suggestions,
      expiration: now + CACHE_EXPIRATION,
      usageCount: (cache[input]?.usageCount || 0) + 1
    };

    // Περιορισμός του μεγέθους του cache σε 100 εγγραφές
    const sortedEntries = Object.entries(cache).sort((a, b) => b[1].usageCount - a[1].usageCount);
    const trimmedCache = Object.fromEntries(sortedEntries.slice(0, 100));

    localStorage.setItem(CACHE_KEY, JSON.stringify(trimmedCache));
  }
};

export default cacheService;
