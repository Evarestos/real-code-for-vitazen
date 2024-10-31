const optimizationService = require('../services/optimizationService');
const continuousOptimizationService = require('../services/continuousOptimizationService');
const advancedAnalysisService = require('../services/advancedAnalysisService');
const encryptionService = require('../services/encryptionService');
const anonymizationService = require('../services/anonymizationService');
const experimentService = require('../services/experimentService');
const predictionService = require('../services/predictionService');
const sharingService = require('../services/sharingService');
const experimentSuggestionService = require('../services/experimentSuggestionService');
const multiStageExperimentService = require('../services/multiStageExperimentService');
const machineLearningService = require('../services/machineLearningService');
const anomalyDetectionService = require('../services/anomalyDetectionService');

// ...

exports.optimizeExperiment = async (req, res) => {
  try {
    const bestVariation = await optimizationService.optimizeExperiment(req.params.experimentId);
    res.json({ message: 'Experiment optimized successfully', bestVariation });
  } catch (error) {
    res.status(500).json({ message: 'Error optimizing experiment', error: error.message });
  }
};

exports.optimizeExperimentGroup = async (req, res) => {
  try {
    const optimizationResults = await optimizationService.optimizeExperimentGroup(req.params.groupId);
    res.json({ message: 'Experiment group optimized successfully', optimizationResults });
  } catch (error) {
    res.status(500).json({ message: 'Error optimizing experiment group', error: error.message });
  }
};

exports.startContinuousOptimization = async (req, res) => {
  try {
    const { id } = req.params;
    const { interval } = req.body;
    continuousOptimizationService.startContinuousOptimization(id, interval);
    res.json({ message: 'Continuous optimization started successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error starting continuous optimization', error: error.message });
  }
};

exports.stopContinuousOptimization = async (req, res) => {
  try {
    const { id } = req.params;
    continuousOptimizationService.stopContinuousOptimization(id);
    res.json({ message: 'Continuous optimization stopped successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error stopping continuous optimization', error: error.message });
  }
};

exports.getAdvancedAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const insights = await advancedAnalysisService.performAdvancedAnalysis(id);
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: 'Error performing advanced analysis', error: error.message });
  }
};

exports.getExperimentResults = async (req, res) => {
  try {
    let results = await ExperimentModel.findById(req.params.id).select('results');
    
    // Αποκρυπτογράφηση των αποτελεσμάτων
    results = encryptionService.decrypt(results);
    
    // Ανωνυμοποίηση των δεδομένων πριν την αποστολή
    const anonymizedResults = anonymizationService.anonymizeData(results);
    
    res.json(anonymizedResults);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experiment results', error: error.message });
  }
};

exports.saveExperimentResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { results } = req.body;
    
    // Κρυπτογράφηση των αποτελεσμάτων πριν την αποθήκευση
    const encryptedResults = encryptionService.encrypt(JSON.stringify(results));
    
    await ExperimentModel.findByIdAndUpdate(id, { results: encryptedResults });
    
    res.json({ message: 'Experiment results saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving experiment results', error: error.message });
  }
};

exports.createMultivariateExperiment = async (req, res) => {
  try {
    const experiment = await experimentService.createMultivariateExperiment(req.body);
    res.status(201).json(experiment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating multivariate experiment', error: error.message });
  }
};

exports.updateExperimentMetrics = async (req, res) => {
  try {
    const { id, variantIndex } = req.params;
    const updatedExperiment = await experimentService.updateExperimentMetrics(id, variantIndex, req.body);
    res.json(updatedExperiment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating experiment metrics', error: error.message });
  }
};

exports.predictExperimentSuccess = async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);
    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }
    const prediction = await machineLearningService.predictConversionRate(experiment);
    res.json({ predictedConversionRate: prediction });
  } catch (error) {
    res.status(500).json({ message: 'Error predicting experiment success', error: error.message });
  }
};

exports.getExperimentWithExternalData = async (req, res) => {
  try {
    const experimentData = await experimentService.getExperimentWithExternalData(req.params.id);
    res.json(experimentData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experiment with external data', error: error.message });
  }
};

exports.shareExperiment = async (req, res) => {
  try {
    const { id } = req.params;
    const { sharedWithEmail, permissions } = req.body;
    const sharedExperiment = await sharingService.shareExperiment(id, req.user._id, sharedWithEmail, permissions);
    res.json(sharedExperiment);
  } catch (error) {
    res.status(500).json({ message: 'Error sharing experiment', error: error.message });
  }
};

exports.getSharedExperiments = async (req, res) => {
  try {
    const sharedExperiments = await sharingService.getSharedExperiments(req.user._id);
    res.json(sharedExperiments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shared experiments', error: error.message });
  }
};

exports.makeExperimentPublic = async (req, res) => {
  try {
    const { id } = req.params;
    const publicExperiment = await sharingService.makeExperimentPublic(id, req.user._id);
    res.json(publicExperiment);
  } catch (error) {
    res.status(500).json({ message: 'Error making experiment public', error: error.message });
  }
};

exports.getPublicExperiments = async (req, res) => {
  try {
    const publicExperiments = await sharingService.getPublicExperiments();
    res.json(publicExperiments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public experiments', error: error.message });
  }
};

exports.getExperimentSuggestions = async (req, res) => {
  try {
    const suggestions = await machineLearningService.generateExperimentSuggestions(req.user._id);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Error generating experiment suggestions', error: error.message });
  }
};

exports.createMultiStageExperiment = async (req, res) => {
  try {
    const experiment = await multiStageExperimentService.createMultiStageExperiment(req.body);
    res.status(201).json(experiment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating multi-stage experiment', error: error.message });
  }
};

exports.advanceExperimentStage = async (req, res) => {
  try {
    const experiment = await multiStageExperimentService.advanceToNextStage(req.params.id);
    res.json(experiment);
  } catch (error) {
    res.status(500).json({ message: 'Error advancing experiment stage', error: error.message });
  }
};

exports.checkAndAdvanceExperimentStage = async (req, res) => {
  try {
    const experiment = await multiStageExperimentService.checkAndAdvanceStage(req.params.id);
    res.json(experiment);
  } catch (error) {
    res.status(500).json({ message: 'Error checking and advancing experiment stage', error: error.message });
  }
};

exports.optimizeCurrentStage = async (req, res) => {
  try {
    const experiment = await multiStageExperimentService.optimizeCurrentStage(req.params.id);
    res.json(experiment);
  } catch (error) {
    res.status(500).json({ message: 'Error optimizing current stage', error: error.message });
  }
};

exports.detectAnomalies = async (req, res) => {
  try {
    const { id } = req.params;
    const anomalies = await anomalyDetectionService.detectAnomalies(id);
    res.json(anomalies);
  } catch (error) {
    res.status(500).json({ message: 'Error detecting anomalies', error: error.message });
  }
};
