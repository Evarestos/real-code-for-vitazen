const Feedback = require('../models/Feedback');
const Suggestion = require('../models/Suggestion');
const User = require('../models/User');
const mlService = require('./mlService');

const FeedbackAnalytics = {
  async submitDetailedFeedback(feedbackData) {
    const feedback = new Feedback(feedbackData);
    await feedback.save();

    // Ενημέρωση του ML model
    await mlService.analyzeFeedback();
  },

  async getFeedbackStatistics() {
    const totalFeedback = await Feedback.countDocuments();
    const averageRating = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const categoryStats = await Feedback.aggregate([
      { $group: { _id: '$categoryId', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { category: '$category.name', count: 1, avgRating: 1 } }
    ]);

    return {
      totalFeedback,
      averageRating: averageRating[0]?.avgRating || 0,
      categoryStats
    };
  },

  async getFeedbackInsights() {
    const recentTrends = await Feedback.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: 1000 },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, avgRating: { $avg: '$rating' } } },
      { $sort: { _id: 1 } }
    ]);

    const topSuggestions = await Suggestion.find().sort({ score: -1 }).limit(10);

    const userEngagement = await User.aggregate([
      { $lookup: { from: 'feedbacks', localField: '_id', foreignField: 'userId', as: 'userFeedbacks' } },
      { $project: { username: 1, feedbackCount: { $size: '$userFeedbacks' } } },
      { $sort: { feedbackCount: -1 } },
      { $limit: 10 }
    ]);

    return {
      recentTrends,
      topSuggestions,
      userEngagement
    };
  },

  async processBatchFeedback(feedbackBatch) {
    await Feedback.insertMany(feedbackBatch);
    await mlService.analyzeFeedback();
  }
};

module.exports = FeedbackAnalytics;
