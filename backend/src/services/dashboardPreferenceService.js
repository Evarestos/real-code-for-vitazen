const DashboardPreference = require('../models/DashboardPreference');

class DashboardPreferenceService {
  async savePreference(userId, name, layout, filters, isDefault = false) {
    let preference = await DashboardPreference.findOne({ userId, name });
    if (preference) {
      preference.versions.push({ layout, filters });
      preference.currentVersion = preference.versions.length - 1;
    } else {
      preference = new DashboardPreference({
        userId,
        name,
        versions: [{ layout, filters }],
        isDefault
      });
    }
    await preference.save();
    return preference;
  }

  async getPreferences(userId) {
    return await DashboardPreference.find({ userId });
  }

  async getPreferenceById(id) {
    return await DashboardPreference.findById(id);
  }

  async updatePreference(id, layout, filters) {
    const preference = await DashboardPreference.findById(id);
    if (!preference) {
      throw new Error('Preference not found');
    }
    preference.versions.push({ layout, filters });
    preference.currentVersion = preference.versions.length - 1;
    await preference.save();
    return preference;
  }

  async undo(id) {
    const preference = await DashboardPreference.findById(id);
    if (!preference || preference.currentVersion <= 0) {
      throw new Error('Cannot undo');
    }
    preference.currentVersion--;
    await preference.save();
    return preference;
  }

  async redo(id) {
    const preference = await DashboardPreference.findById(id);
    if (!preference || preference.currentVersion >= preference.versions.length - 1) {
      throw new Error('Cannot redo');
    }
    preference.currentVersion++;
    await preference.save();
    return preference;
  }

  async deletePreference(id) {
    return await DashboardPreference.findByIdAndDelete(id);
  }

  async getDefaultPreference(userId) {
    return await DashboardPreference.findOne({ userId, isDefault: true });
  }

  async setDefaultPreference(userId, preferenceId) {
    await DashboardPreference.updateMany({ userId }, { isDefault: false });
    return await DashboardPreference.findByIdAndUpdate(preferenceId, { isDefault: true }, { new: true });
  }
}

module.exports = new DashboardPreferenceService();
