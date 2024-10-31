const Feedback = require('../models/Feedback');
const Suggestion = require('../models/Suggestion');
const User = require('../models/User');

const mlService = {
  async analyzeFeedback() {
    const recentFeedback = await Feedback.find({
      timestamp: { $gte: new Date(Date.now() - 24*60*60*1000) } // Τελευταίες 24 ώρες
    }).populate('categoryId');

    const suggestionPerformance = {};
    const categoryPerformance = {};
    const userPreferences = {};

    for (const feedback of recentFeedback) {
      // Ανάλυση απόδοσης προτάσεων
      if (!suggestionPerformance[feedback.suggestionId]) {
        suggestionPerformance[feedback.suggestionId] = { total: 0, positive: 0 };
      }
      suggestionPerformance[feedback.suggestionId].total++;
      if (feedback.rating > 0) {
        suggestionPerformance[feedback.suggestionId].positive++;
      }

      // Ανάλυση απόδοσης κατηγοριών
      if (feedback.categoryId) {
        const categoryId = feedback.categoryId._id.toString();
        if (!categoryPerformance[categoryId]) {
          categoryPerformance[categoryId] = { total: 0, positive: 0 };
        }
        categoryPerformance[categoryId].total++;
        if (feedback.rating > 0) {
          categoryPerformance[categoryId].positive++;
        }
      }

      // Ανάλυση προτιμήσεων χρηστών
      if (!userPreferences[feedback.userId]) {
        userPreferences[feedback.userId] = { categories: {}, suggestions: {} };
      }
      if (feedback.categoryId) {
        const categoryId = feedback.categoryId._id.toString();
        if (!userPreferences[feedback.userId].categories[categoryId]) {
          userPreferences[feedback.userId].categories[categoryId] = 0;
        }
        userPreferences[feedback.userId].categories[categoryId] += feedback.rating;
      }
      if (!userPreferences[feedback.userId].suggestions[feedback.suggestionId]) {
        userPreferences[feedback.userId].suggestions[feedback.suggestionId] = 0;
      }
      userPreferences[feedback.userId].suggestions[feedback.suggestionId] += feedback.rating;
    }

    // Ενημέρωση των rankings των προτάσεων
    for (const [suggestionId, performance] of Object.entries(suggestionPerformance)) {
      const score = performance.positive / performance.total;
      await Suggestion.findByIdAndUpdate(suggestionId, { $set: { score: score } });
    }

    // Ενημέρωση των προτιμήσεων των χρηστών
    for (const [userId, preferences] of Object.entries(userPreferences)) {
      await User.findByIdAndUpdate(userId, { $set: { preferences: preferences } });
    }

    return {
      suggestionPerformance,
      categoryPerformance,
      userPreferences
    };
  },

  async getPersonalizedSuggestions(userId, categoryId) {
    const user = await User.findById(userId);
    let suggestions;

    if (categoryId) {
      suggestions = await Suggestion.find({ categoryId: categoryId })
        .sort({ score: -1 })
        .limit(10);
    } else {
      suggestions = await Suggestion.find({})
        .sort({ score: -1 })
        .limit(10);
    }

    // Προσαρμογή των προτάσεων βάσει των προτιμήσεων του χρήστη
    if (user.preferences && user.preferences.suggestions) {
      suggestions.sort((a, b) => {
        const scoreA = user.preferences.suggestions[a._id] || 0;
        const scoreB = user.preferences.suggestions[b._id] || 0;
        return scoreB - scoreA;
      });
    }

    return suggestions;
  },

  async performABTesting(userId, suggestions) {
    // Απλή υλοποίηση A/B testing
    const testGroup = Math.random() < 0.5 ? 'A' : 'B';
    
    if (testGroup === 'A') {
      return suggestions;
    } else {
      // Εναλλακτική ταξινόμηση για την ομάδα B
      return suggestions.sort(() => Math.random() - 0.5);
    }
  }
};

module.exports = mlService;
