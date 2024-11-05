const tf = require('@tensorflow/tfjs-node');
const natural = require('natural');
const redis = require('redis');
const Content = require('../models/Content');
const User = require('../models/User');

class RecommendationService {
  constructor() {
    this.redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
  }

  async initializeContentBasedFiltering() {
    const contents = await Content.find({});
    contents.forEach((content, index) => {
      this.tfidf.addDocument(this.tokenizer.tokenize(`${content.title} ${content.description} ${content.tags.join(' ')}`));
    });
  }

  async getContentBasedRecommendations(userId, n = 5) {
    const user = await User.findById(userId).populate('viewedContent');
    if (!user.viewedContent.length) return [];

    const userProfile = this.createUserProfile(user.viewedContent);
    const allContent = await Content.find({ _id: { $nin: user.viewedContent.map(c => c._id) } });

    const scores = allContent.map(content => {
      const contentVector = this.tfidf.tfidf(this.tokenizer.tokenize(`${content.title} ${content.description} ${content.tags.join(' ')}`), 0);
      return {
        content,
        score: this.cosineSimilarity(userProfile, contentVector)
      };
    });

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, n).map(s => s.content);
  }

  createUserProfile(viewedContent) {
    const profile = {};
    viewedContent.forEach(content => {
      const terms = this.tokenizer.tokenize(`${content.title} ${content.description} ${content.tags.join(' ')}`);
      terms.forEach(term => {
        profile[term] = (profile[term] || 0) + 1;
      });
    });
    return profile;
  }

  cosineSimilarity(vec1, vec2) {
    const intersection = Object.keys(vec1).filter(key => key in vec2);
    const numerator = intersection.reduce((acc, key) => acc + vec1[key] * vec2[key], 0);
    
    const sum1 = Object.keys(vec1).reduce((acc, key) => acc + vec1[key] ** 2, 0);
    const sum2 = Object.keys(vec2).reduce((acc, key) => acc + vec2[key] ** 2, 0);
    const denominator = Math.sqrt(sum1) * Math.sqrt(sum2);

    if (denominator === 0) return 0;
    return numerator / denominator;
  }

  async trainCollaborativeModel(userContentMatrix) {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 50, activation: 'relu', inputShape: [userContentMatrix[0].length] }));
    model.add(tf.layers.dense({ units: 20, activation: 'relu' }));
    model.add(tf.layers.dense({ units: userContentMatrix[0].length, activation: 'sigmoid' }));

    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' });

    const xs = tf.tensor2d(userContentMatrix);
    await model.fit(xs, xs, { epochs: 100, batchSize: 32 });

    return model;
  }

  async getCollaborativeRecommendations(userId, model, contentIds, n = 5) {
    const user = await User.findById(userId);
    const userVector = contentIds.map(id => user.viewedContent.includes(id) ? 1 : 0);
    
    const input = tf.tensor2d([userVector]);
    const prediction = model.predict(input);
    const recommendationScores = await prediction.data();

    const recommendations = contentIds
      .map((id, index) => ({ id, score: recommendationScores[index] }))
      .filter(item => !user.viewedContent.includes(item.id))
      .sort((a, b) => b.score - a.score)
      .slice(0, n);

    return recommendations;
  }

  async cacheRecommendations(userId, recommendations, type) {
    const key = `recommendations:${type}:${userId}`;
    await this.redisClient.setex(key, 3600, JSON.stringify(recommendations)); // Cache for 1 hour
  }

  async getCachedRecommendations(userId, type) {
    const key = `recommendations:${type}:${userId}`;
    const cachedRecommendations = await this.redisClient.get(key);
    return cachedRecommendations ? JSON.parse(cachedRecommendations) : null;
  }

  async getRecommendations(userId) {
    let recommendations = await this.getCachedRecommendations(userId, 'combined');
    if (recommendations) return recommendations;

    const contentBased = await this.getContentBasedRecommendations(userId);
    // Assume we have trained the collaborative model and have it available
    const collaborative = await this.getCollaborativeRecommendations(userId, this.collaborativeModel, this.contentIds);

    recommendations = this.combineRecommendations(contentBased, collaborative);
    await this.cacheRecommendations(userId, recommendations, 'combined');

    return recommendations;
  }

  combineRecommendations(contentBased, collaborative) {
    // Simple combination strategy: alternate between content-based and collaborative
    const combined = [];
    const maxLength = Math.max(contentBased.length, collaborative.length);
    for (let i = 0; i < maxLength; i++) {
      if (i < contentBased.length) combined.push(contentBased[i]);
      if (i < collaborative.length) combined.push(collaborative[i]);
    }
    return combined.slice(0, 10); // Return top 10 combined recommendations
  }

  async analyzeUserBehavior(userId) {
    const user = await User.findById(userId).populate('viewedContent');
    const viewCounts = {};
    const tagCounts = {};

    user.viewedContent.forEach(content => {
      viewCounts[content.category] = (viewCounts[content.category] || 0) + 1;
      content.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return {
      mostViewedCategory: Object.entries(viewCounts).sort((a, b) => b[1] - a[1])[0][0],
      topTags: Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(entry => entry[0])
    };
  }

  async getHybridRecommendations(userId, n = 10) {
    const contentBased = await this.getContentBasedRecommendations(userId, n / 2);
    const collaborative = await this.getCollaborativeRecommendations(userId, n / 2);
    const behavior = await this.analyzeUserBehavior(userId);

    const recommendations = [...contentBased, ...collaborative];
    
    // Boost recommendations that match user behavior
    recommendations.forEach(rec => {
      if (rec.category === behavior.mostViewedCategory) rec.score += 0.2;
      rec.tags.forEach(tag => {
        if (behavior.topTags.includes(tag)) rec.score += 0.1;
      });
    });

    recommendations.sort((a, b) => b.score - a.score);
    return recommendations.slice(0, n);
  }
}

module.exports = new RecommendationService();
