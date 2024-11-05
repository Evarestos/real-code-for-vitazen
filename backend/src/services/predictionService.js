const tf = require('@tensorflow/tfjs-node');
const Experiment = require('../models/Experiment');

class PredictionService {
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

  async predictSuccess(experiment) {
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
      experiment.variables.length,
      experiment.variants.length,
      experiment.startDate ? new Date(experiment.startDate).getTime() : 0,
      // Add more features as needed
    ];
  }
}

module.exports = new PredictionService();
