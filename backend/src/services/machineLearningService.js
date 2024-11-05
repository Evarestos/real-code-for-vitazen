const tf = require('@tensorflow/tfjs-node');
const Experiment = require('../models/Experiment');

class MachineLearningService {
  constructor() {
    this.model = null;
  }

  async trainModel() {
    const experiments = await Experiment.find({ status: 'completed' });
    const features = experiments.map(this.extractFeatures);
    const labels = experiments.map(exp => exp.metrics.conversionRate);

    const tensorFeatures = tf.tensor2d(features);
    const tensorLabels = tf.tensor1d(labels);

    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [features[0].length], units: 64, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1 })
      ]
    });

    this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    await this.model.fit(tensorFeatures, tensorLabels, {
      epochs: 100,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}, val_loss = ${logs.val_loss}`);
        }
      }
    });
  }

  async predictConversionRate(experiment) {
    if (!this.model) {
      await this.trainModel();
    }

    const features = this.extractFeatures(experiment);
    const tensorFeatures = tf.tensor2d([features]);
    const prediction = this.model.predict(tensorFeatures);
    return prediction.dataSync()[0];
  }

  extractFeatures(experiment) {
    // Extract relevant features from the experiment
    // This is a simplified example, you'd want to include more relevant features
    return [
      experiment.variants.length,
      experiment.duration,
      experiment.totalParticipants,
      // Add more features as needed
    ];
  }

  async generateExperimentSuggestions(userId) {
    const userExperiments = await Experiment.find({ user: userId, status: 'completed' });
    const suggestions = [];

    for (const experiment of userExperiments) {
      const predictedConversionRate = await this.predictConversionRate(experiment);
      if (predictedConversionRate > experiment.metrics.conversionRate) {
        suggestions.push({
          baseExperiment: experiment._id,
          suggestedChanges: this.suggestChanges(experiment, predictedConversionRate)
        });
      }
    }

    return suggestions;
  }

  suggestChanges(experiment, predictedConversionRate) {
    // Logic to suggest changes based on the experiment and predicted conversion rate
    // This could include adjusting variant parameters, targeting, etc.
    // ...
  }
}

module.exports = new MachineLearningService();
