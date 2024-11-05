const UserPreferences = require('../models/UserPreferences');

class UserPreferencesService {
  async getPreferences(userId) {
    let preferences = await UserPreferences.findOne({ userId });
    if (!preferences) {
      preferences = await this.createDefaultPreferences(userId);
    }
    return preferences;
  }

  async createDefaultPreferences(userId) {
    const defaultPreferences = new UserPreferences({ userId });
    return await defaultPreferences.save();
  }

  async updatePreferences(userId, updates) {
    const preferences = await UserPreferences.findOneAndUpdate(
      { userId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );
    return preferences;
  }

  async resetToDefaults(userId) {
    await UserPreferences.findOneAndDelete({ userId });
    return await this.createDefaultPreferences(userId);
  }
}

module.exports = new UserPreferencesService();
