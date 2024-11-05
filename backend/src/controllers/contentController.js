const Content = require('../models/Content');
const { getAsync, setAsync } = require('../utils/redis');

const CACHE_EXPIRATION = 3600; // 1 hour

exports.getContentByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const cacheKey = `content:${category}:${page}:${limit}`;
    const cachedResult = await getAsync(cacheKey);

    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }

    const totalItems = await Content.countDocuments({ category });
    const totalPages = Math.ceil(totalItems / limit);

    const content = await Content.find({ category })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const result = {
      content,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    await setAsync(cacheKey, JSON.stringify(result), 'EX', CACHE_EXPIRATION);

    res.json(result);
  } catch (error) {
    console.error('Σφάλμα κατά την ανάκτηση περιεχομένου:', error);
    res.status(500).json({ error: 'Εσωτερικό σφάλμα διακομιστή' });
  }
};

exports.searchContent = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!q) {
      return res.status(400).json({ error: 'Απαιτείται όρος αναζήτησης' });
    }

    const cacheKey = `search:${q}:${page}:${limit}`;
    const cachedResult = await getAsync(cacheKey);

    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }

    const totalItems = await Content.countDocuments({ $text: { $search: q } });
    const totalPages = Math.ceil(totalItems / limit);

    const content = await Content.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const result = {
      content,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    await setAsync(cacheKey, JSON.stringify(result), 'EX', CACHE_EXPIRATION);

    res.json(result);
  } catch (error) {
    console.error('Σφάλμα κατά την αναζήτηση περιεχομένου:', error);
    res.status(500).json({ error: 'Εσωτερικό σφάλμα διακομιστή' });
  }
};

exports.filterContent = async (req, res) => {
  try {
    const { category, tags, creator } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let query = {};
    if (category) query.category = category;
    if (creator) query.creator = creator;
    if (tags) query.tags = { $in: tags.split(',') };

    const cacheKey = `filter:${JSON.stringify(query)}:${page}:${limit}`;
    const cachedResult = await getAsync(cacheKey);

    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }

    const totalItems = await Content.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const result = {
      content,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    await setAsync(cacheKey, JSON.stringify(result), 'EX', CACHE_EXPIRATION);

    res.json(result);
  } catch (error) {
    console.error('Σφάλμα κατά το φιλτράρισμα περιεχομένου:', error);
    res.status(500).json({ error: 'Εσωτερικό σφάλμα διακομιστή' });
  }
};

exports.getContentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ error: 'Το περιεχόμενο δεν βρέθηκε' });
    }
    res.json(content);
  } catch (error) {
    console.error('Σφάλμα κατά την ανάκτηση λεπτομερειών περιεχομένου:', error);
    res.status(500).json({ error: 'Εσωτερικό σφάλμα διακομιστή' });
  }
};

exports.getRelatedContent = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ error: 'Το περιεχόμενο δεν βρέθηκε' });
    }
    const relatedContent = await Content.find({
      $or: [
        { category: content.category },
        { tags: { $in: content.tags } }
      ],
      _id: { $ne: content._id }
    }).limit(5);
    res.json(relatedContent);
  } catch (error) {
    console.error('Σφάλμα κατά την ανάκτηση σχετικού περιεχομένου:', error);
    res.status(500).json({ error: 'Εσωτερικό σφάλμα διακομιστή' });
  }
};
