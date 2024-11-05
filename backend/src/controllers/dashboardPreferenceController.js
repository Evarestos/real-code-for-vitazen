const dashboardPreferenceService = require('../services/dashboardPreferenceService');

exports.savePreference = async (req, res) => {
  try {
    const { name, layout, filters, isDefault } = req.body;
    const preference = await dashboardPreferenceService.savePreference(req.user.id, name, layout, filters, isDefault);
    res.status(201).json(preference);
  } catch (error) {
    res.status(500).json({ message: 'Error saving dashboard preference', error: error.message });
  }
};

exports.getPreferences = async (req, res) => {
  try {
    const preferences = await dashboardPreferenceService.getPreferences(req.user.id);
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard preferences', error: error.message });
  }
};

exports.updatePreference = async (req, res) => {
  try {
    const { id } = req.params;
    const { layout, filters } = req.body;
    const updatedPreference = await dashboardPreferenceService.updatePreference(id, layout, filters);
    res.json(updatedPreference);
  } catch (error) {
    res.status(500).json({ message: 'Error updating dashboard preference', error: error.message });
  }
};

exports.undo = async (req, res) => {
  try {
    const { id } = req.params;
    const preference = await dashboardPreferenceService.undo(id);
    res.json(preference);
  } catch (error) {
    res.status(400).json({ message: 'Cannot undo', error: error.message });
  }
};

exports.redo = async (req, res) => {
  try {
    const { id } = req.params;
    const preference = await dashboardPreferenceService.redo(id);
    res.json(preference);
  } catch (error) {
    res.status(400).json({ message: 'Cannot redo', error: error.message });
  }
};

exports.deletePreference = async (req, res) => {
  try {
    const { id } = req.params;
    await dashboardPreferenceService.deletePreference(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting dashboard preference', error: error.message });
  }
};

exports.getDefaultPreference = async (req, res) => {
  try {
    const defaultPreference = await dashboardPreferenceService.getDefaultPreference(req.user.id);
    res.json(defaultPreference);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching default dashboard preference', error: error.message });
  }
};

exports.setDefaultPreference = async (req, res) => {
  try {
    const { id } = req.params;
    const defaultPreference = await dashboardPreferenceService.setDefaultPreference(req.user.id, id);
    res.json(defaultPreference);
  } catch (error) {
    res.status(500).json({ message: 'Error setting default dashboard preference', error: error.message });
  }
};
