const ChatContext = require('../models/ChatContext');
const User = require('../models/User');
const Category = require('../models/Category');
const mlService = require('./mlService');
const Feedback = require('../models/Feedback');

const suggestionService = {
  async generateSuggestions(userId, input, categoryId = null) {
    const user = await User.findById(userId);
    const recentContexts = await ChatContext.find({ userId }).sort({ updatedAt: -1 }).limit(5);

    let suggestions = await mlService.getPersonalizedSuggestions(userId, categoryId);

    // Φιλτράρισμα προτάσεων βάσει του input
    suggestions = suggestions.filter(suggestion => 
      suggestion.content.toLowerCase().includes(input.toLowerCase())
    );

    // Προσθήκη προτάσεων από πρόσφατα contexts
    for (const context of recentContexts) {
      const relevantMessages = context.messages.filter(msg => 
        msg.content.toLowerCase().includes(input.toLowerCase())
      );
      suggestions.push(...relevantMessages.map(msg => msg.content));
    }

    // Αφαίρεση διπλότυπων και περιορισμός σε 10 προτάσεις
    suggestions = [...new Set(suggestions)].slice(0, 10);

    // Εκτέλεση A/B testing
    suggestions = await mlService.performABTesting(userId, suggestions);

    return suggestions;
  },

  async getCategories() {
    return await Category.find({}).sort({ priority: -1 });
  },

  async submitFeedback(feedbackData) {
    const feedback = new Feedback(feedbackData);
    await feedback.save();

    // Ενημέρωση του ML model
    await mlService.analyzeFeedback();
  }
};

module.exports = suggestionService;
