const { getExperiments, updateExperiment, analyzeExperiment } = require('./experimentService');
import { analyzeData } from './dataAnalysisService';

exports.optimizeExperiments = async () => {
  try {
    const experiments = await getExperiments();
    
    for (const experiment of experiments) {
      const analysis = await analyzeExperiment(experiment._id);
      const optimizedParams = generateOptimizedParams(analysis);
      await updateExperiment(experiment._id, optimizedParams);
    }

    console.log('Experiments optimized successfully');
  } catch (error) {
    console.error('Error optimizing experiments:', error);
  }
};

const generateOptimizedParams = (analysis) => {
  let optimizedParams = {};

  // Βελτιστοποίηση μεγέθους δείγματος
  if (analysis.sampleSizeRecommendation) {
    optimizedParams.sampleSize = analysis.sampleSizeRecommendation;
  }

  // Βελτιστοποίηση διάρκειας
  if (analysis.durationRecommendation) {
    optimizedParams.duration = analysis.durationRecommendation;
  }

  // Βελτιστοποίηση μετρικής-στόχου
  if (analysis.bestPerformingMetric) {
    optimizedParams.targetMetric = analysis.bestPerformingMetric;
  }

  // Βελτιστοποίηση παραμέτρων πειράματος
  if (analysis.parameterRecommendations) {
    optimizedParams.parameters = analysis.parameterRecommendations;
  }

  // Προσθήκη άλλων βελτιστοποιήσεων βάσει της ανάλυσης
  if (analysis.otherRecommendations) {
    optimizedParams = { ...optimizedParams, ...analysis.otherRecommendations };
  }

  return optimizedParams;
};

export const optimizeExperiment = async (experimentId) => {
  try {
    const results = await getExperimentResults(experimentId);
    const analysis = await analyzeData(results);
    
    const optimizedParams = generateOptimizedParams(analysis);
    
    await updateExperiment(experimentId, { parameters: optimizedParams });
    
    return optimizedParams;
  } catch (error) {
    console.error('Error optimizing experiment:', error);
    throw error;
  }
};
