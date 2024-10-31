const ExperimentModel = require('../models/experimentModel');
const AnalysisReportService = require('./analysisReportService');

class OptimizationService {
  constructor() {
    this.analysisReportService = new AnalysisReportService();
  }

  async optimizeExperiment(experimentId) {
    const experiment = await ExperimentModel.findById(experimentId);
    const report = await this.analysisReportService.generateExperimentReport(experimentId);
    
    // Ανάλυση των αποτελεσμάτων και εύρεση της βέλτιστης παραλλαγής
    const bestVariation = this.findBestVariation(report);
    
    // Ενημέρωση του πειράματος με τη βέλτιστη παραλλαγή
    experiment.currentVariation = bestVariation;
    await experiment.save();

    return bestVariation;
  }

  findBestVariation(report) {
    // Υλοποίηση λογικής για την εύρεση της βέλτιστης παραλλαγής
    // Αυτό θα μπορούσε να περιλαμβάνει σύγκριση μετρικών όπως το conversion rate
    // ...

    return bestVariation;
  }

  async optimizeExperimentGroup(groupId) {
    const experiments = await ExperimentModel.find({ group: groupId });
    const optimizationResults = [];

    for (const experiment of experiments) {
      const bestVariation = await this.optimizeExperiment(experiment._id);
      optimizationResults.push({ experimentId: experiment._id, bestVariation });
    }

    return optimizationResults;
  }
}

module.exports = new OptimizationService();
