const OptimizationService = require('./optimizationService');
const ExperimentModel = require('../models/experimentModel');

class ContinuousOptimizationService {
  constructor() {
    this.optimizationService = new OptimizationService();
    this.optimizationIntervals = new Map();
  }

  startContinuousOptimization(experimentId, interval = 3600000) { // Default interval: 1 hour
    if (this.optimizationIntervals.has(experimentId)) {
      console.log(`Continuous optimization already running for experiment ${experimentId}`);
      return;
    }

    const optimizationInterval = setInterval(async () => {
      try {
        await this.optimizeAndApply(experimentId);
      } catch (error) {
        console.error(`Error in continuous optimization for experiment ${experimentId}:`, error);
      }
    }, interval);

    this.optimizationIntervals.set(experimentId, optimizationInterval);
    console.log(`Started continuous optimization for experiment ${experimentId}`);
  }

  stopContinuousOptimization(experimentId) {
    const interval = this.optimizationIntervals.get(experimentId);
    if (interval) {
      clearInterval(interval);
      this.optimizationIntervals.delete(experimentId);
      console.log(`Stopped continuous optimization for experiment ${experimentId}`);
    }
  }

  async optimizeAndApply(experimentId) {
    const bestVariant = await this.optimizationService.optimizeExperiment(experimentId);
    const experiment = await ExperimentModel.findById(experimentId);

    // Υπολογισμός νέων κατανομών κυκλοφορίας
    const totalTraffic = experiment.variants.reduce((sum, v) => sum + v.trafficAllocation, 0);
    const newAllocations = experiment.variants.map(v => ({
      ...v,
      trafficAllocation: v._id.equals(bestVariant._id) ? 
        Math.min(v.trafficAllocation + 10, 100) : // Αύξηση κατά 10% για την καλύτερη παραλλαγή
        Math.max(v.trafficAllocation - 5, 0)  // Μείωση κατά 5% για τις άλλες παραλλαγές
    }));

    // Κανονικοποίηση των κατανομών ώστε το άθροισμα να είναι 100%
    const totalNewAllocation = newAllocations.reduce((sum, v) => sum + v.trafficAllocation, 0);
    experiment.variants = newAllocations.map(v => ({
      ...v,
      trafficAllocation: (v.trafficAllocation / totalNewAllocation) * 100
    }));

    await experiment.save();
    console.log(`Applied optimized variant for experiment ${experimentId}`);
  }
}

module.exports = new ContinuousOptimizationService();
