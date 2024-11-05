const SharedLayout = require('../models/SharedLayout');
const DashboardPreference = require('../models/DashboardPreference');
const User = require('../models/User');

class SharedLayoutService {
  async shareLayout(layoutId, ownerId, sharedWithUserId, permission, expirationDate, message) {
    const layout = await DashboardPreference.findById(layoutId);
    if (!layout) {
      throw new Error('Layout not found');
    }

    if (layout.userId.toString() !== ownerId.toString()) {
      throw new Error('You do not have permission to share this layout');
    }

    let sharedLayout = await SharedLayout.findOne({ layoutId });
    if (!sharedLayout) {
      sharedLayout = new SharedLayout({
        layoutId,
        ownerId,
        sharedWith: [],
        expirationDate,
        message
      });
    }

    const existingShare = sharedLayout.sharedWith.find(share => share.userId.toString() === sharedWithUserId.toString());
    if (existingShare) {
      existingShare.permission = permission;
      existingShare.status = 'pending';
    } else {
      sharedLayout.sharedWith.push({
        userId: sharedWithUserId,
        permission,
        status: 'pending'
      });
    }

    await sharedLayout.save();
    layout.isShared = true;
    await layout.save();

    return sharedLayout;
  }

  async getSharedLayouts(userId) {
    return await SharedLayout.find({ 'sharedWith.userId': userId });
  }

  async updateSharePermission(sharedLayoutId, userId, newPermission) {
    const sharedLayout = await SharedLayout.findById(sharedLayoutId);
    if (!sharedLayout) {
      throw new Error('Shared layout not found');
    }

    const share = sharedLayout.sharedWith.find(share => share.userId.toString() === userId.toString());
    if (!share) {
      throw new Error('User does not have access to this shared layout');
    }

    share.permission = newPermission;
    await sharedLayout.save();

    return sharedLayout;
  }

  async acceptShareInvitation(sharedLayoutId, userId) {
    const sharedLayout = await SharedLayout.findById(sharedLayoutId);
    if (!sharedLayout) {
      throw new Error('Shared layout not found');
    }

    const share = sharedLayout.sharedWith.find(share => share.userId.toString() === userId.toString());
    if (!share) {
      throw new Error('User does not have an invitation for this shared layout');
    }

    share.status = 'accepted';
    await sharedLayout.save();

    return sharedLayout;
  }

  async rejectShareInvitation(sharedLayoutId, userId) {
    const sharedLayout = await SharedLayout.findById(sharedLayoutId);
    if (!sharedLayout) {
      throw new Error('Shared layout not found');
    }

    const share = sharedLayout.sharedWith.find(share => share.userId.toString() === userId.toString());
    if (!share) {
      throw new Error('User does not have an invitation for this shared layout');
    }

    share.status = 'rejected';
    await sharedLayout.save();

    return sharedLayout;
  }

  async removeSharedUser(sharedLayoutId, ownerId, userIdToRemove) {
    const sharedLayout = await SharedLayout.findById(sharedLayoutId);
    if (!sharedLayout) {
      throw new Error('Shared layout not found');
    }

    if (sharedLayout.ownerId.toString() !== ownerId.toString()) {
      throw new Error('You do not have permission to remove users from this shared layout');
    }

    sharedLayout.sharedWith = sharedLayout.sharedWith.filter(share => share.userId.toString() !== userIdToRemove.toString());
    await sharedLayout.save();

    if (sharedLayout.sharedWith.length === 0) {
      const layout = await DashboardPreference.findById(sharedLayout.layoutId);
      if (layout) {
        layout.isShared = false;
        await layout.save();
      }
      await SharedLayout.findByIdAndDelete(sharedLayoutId);
    }

    return sharedLayout;
  }
}

module.exports = new SharedLayoutService();
