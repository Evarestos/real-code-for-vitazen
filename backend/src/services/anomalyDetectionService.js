const Experiment = require('../models/Experiment');
const tf = require('@tensorflow/tfjs-node');
import { getExperimentResults } from './experimentService';

class AnomalyDetectionService {
  async detectAnomalies(experimentId) {
    try {
      const results = await getExperimentResults(experimentId);
      const anomalies = analyzeForAnomalies(results);
      return anomalies;
    } catch (error) {
      console.error('Error detecting anomalies:', error);
      throw error;
    }
  }

  async getExperimentData(experimentId) {
    // Fetch experiment data from database or other data source
    // This is a placeholder implementation
    return [/* array of data points */];
  }

  runAnomalyDetection(data) {
    // Implement anomaly detection algorithm
    // This is a simple example using Z-score method
    const mean = tf.mean(data);
    const std = tf.moments(data).variance.sqrt();
    const zScores = data.map(value => Math.abs((value - mean) / std));
    
    const threshold = 3; // Adjust as needed
    const anomalies = zScores.map((score, index) => score > threshold ? index : -1).filter(index => index !== -1);
    
    return anomalies;
  }

  async handleAnomalies(experimentId, anomalies) {
    const handledAnomalies = [];
    for (const anomalyIndex of anomalies) {
      const handledAnomaly = await this.handleAnomaly(experimentId, anomalyIndex);
      handledAnomalies.push(handledAnomaly);
    }
    return handledAnomalies;
  }

  async handleAnomaly(experimentId, anomalyIndex) {
    // Implement logic to handle the anomaly
    // This could involve removing the data point, adjusting it, or flagging it for review
    // This is a placeholder implementation
    return {
      experimentId,
      anomalyIndex,
      action: 'flagged for review'
    };
  }
}

const analyzeForAnomalies = (results) => {
  const anomalies = [];
  const mean = calculateMean(results);
  const stdDev = calculateStandardDeviation(results, mean);

  results.forEach((result, index) => {
    if (Math.abs(result.value - mean) > 3 * stdDev) {
      anomalies.push({
        type: 'Outlier',
        value: result.value,
        timestamp: result.timestamp,
        index: index
      });
    }
  });

  return anomalies;
};

const calculateMean = (results) => {
  const sum = results.reduce((acc, result) => acc + result.value, 0);
  return sum / results.length;
};

const calculateStandardDeviation = (results, mean) => {
  const squareDiffs = results.map(result => Math.pow(result.value - mean, 2));
  const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / results.length;
  return Math.sqrt(avgSquareDiff);
};

module.exports = new AnomalyDetectionService();
