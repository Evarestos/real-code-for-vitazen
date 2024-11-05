const sharedLayoutService = require('../services/sharedLayoutService');

exports.shareLayout = async (req, res) => {
  try {
    const { layoutId, sharedWithUserId, permission, expirationDate, message } = req.body;
    const sharedLayout = await sharedLayoutService.shareLayout(
      layoutId,
      req.user.id,
      sharedWithUserId,
      permission,
      expirationDate,
      message
    );
    res.status(201).json(sharedLayout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getSharedLayouts = async (req, res) => {
  try {
    const sharedLayouts = await sharedLayoutService.getSharedLayouts(req.user.id);
    res.json(sharedLayouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSharePermission = async (req, res) => {
  try {
    const { sharedLayoutId, userId, newPermission } = req.body;
    const updatedSharedLayout = await sharedLayoutService.updateSharePermission(sharedLayoutId, userId, newPermission);
    res.json(updatedSharedLayout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.acceptShareInvitation = async (req, res) => {
  try {
    const { sharedLayoutId } = req.params;
    const acceptedSharedLayout = await sharedLayoutService.acceptShareInvitation(sharedLayoutId, req.user.id);
    res.json(acceptedSharedLayout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.rejectShareInvitation = async (req, res) => {
  try {
    const { sharedLayoutId } = req.params;
    const rejectedSharedLayout = await sharedLayoutService.rejectShareInvitation(sharedLayoutId, req.user.id);
    res.json(rejectedSharedLayout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeSharedUser = async (req, res) => {
  try {
    const { sharedLayoutId, userIdToRemove } = req.params;
    const updatedSharedLayout = await sharedLayoutService.removeSharedUser(sharedLayoutId, req.user.id, userIdToRemove);
    res.json(updatedSharedLayout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
