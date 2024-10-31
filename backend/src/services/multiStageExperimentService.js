const Experiment = require('../models/Experiment');
const optimizationService = require('./optimizationService');

class MultiStageExperimentService {
  async createMultiStageExperiment(experimentData) {
    const experiment = new Experiment({
      ...experimentData,
      type: 'multi-stage'
    });
    return await experiment.save();
  }

  async advanceToNextStage(experimentId) {
    const experiment = await Experiment.findById(experimentId);
    if (experiment.currentStage >= experiment.stages.length - 1) {
      throw new Error('Experiment is already at the final stage');
    }
    experiment.currentStage += 1;
    return await experiment.save();
  }

  async checkAndAdvanceStage(experimentId) {
    const experiment = await Experiment.findById(experimentId);
    const currentStage = experiment.stages[experiment.currentStage];
    
    if (this.shouldAdvanceStage(experiment, currentStage)) {
      return await this.advanceToNextStage(experimentId);
    }
    
    return experiment;
  }

  shouldAdvanceStage(experiment, stage) {
    // Implement logic to check if the experiment should advance to the next stage
    // This could be based on time, metrics, or other conditions
    // ...
  }

  async optimizeCurrentStage(experimentId) {
    const experiment = await Experiment.findById(experimentId);
    const currentStage = experiment.stages[experiment.currentStage];
    
    const optimizedVariants = await optimizationService.optimizeVariants(currentStage.variants);
    
    experiment.stages[experiment.currentStage].variants = optimizedVariants;
    return await experiment.save();
  }
}

module.exports = new MultiStageExperimentService();
