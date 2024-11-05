const Experiment = require('../models/Experiment');
const User = require('../models/User');

class SharingService {
  async shareExperiment(experimentId, ownerId, sharedWithEmail, permissions) {
    const experiment = await Experiment.findOne({ _id: experimentId, owner: ownerId });
    if (!experiment) {
      throw new Error('Experiment not found or you do not have permission to share it');
    }

    const sharedWithUser = await User.findOne({ email: sharedWithEmail });
    if (!sharedWithUser) {
      throw new Error('User to share with not found');
    }

    experiment.sharedWith.push({
      user: sharedWithUser._id,
      permissions
    });

    await experiment.save();
    return experiment;
  }

  async getSharedExperiments(userId) {
    return Experiment.find({ 'sharedWith.user': userId });
  }

  async makeExperimentPublic(experimentId, ownerId) {
    const experiment = await Experiment.findOne({ _id: experimentId, owner: ownerId });
    if (!experiment) {
      throw new Error('Experiment not found or you do not have permission to modify it');
    }

    experiment.isPublic = true;
    await experiment.save();
    return experiment;
  }

  async getPublicExperiments() {
    return Experiment.find({ isPublic: true });
  }
}

module.exports = new SharingService();
