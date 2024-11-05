const userPreferencesService = require('../services/userPreferencesService');

exports.getPreferences = async (req, res) => {
  try {
    const preferences = await userPreferencesService.getPreferences(req.user.id);
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching preferences', error: error.message });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const updatedPreferences = await userPreferencesService.updatePreferences(req.user.id, req.body);
    res.json(updatedPreferences);
  } catch (error) {
    res.status(400).json({ message: 'Error updating preferences', error: error.message });
  }
};

exports.resetPreferences = async (req, res) => {
  try {
    const defaultPreferences = await userPreferencesService.resetToDefaults(req.user.id);
    res.json(defaultPreferences);
  } catch (error) {
    res.status(500).json({ message: 'Error resetting preferences', error: error.message });
  }
};
