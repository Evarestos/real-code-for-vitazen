const Experiment = require('../models/Experiment');
const externalDataService = require('./externalDataService');
const { analyzeExperimentData } = require('./dataAnalysisService');
import api from '../utils/api';

class ExperimentService {
  async createMultivariateExperiment(experimentData) {
    const experiment = new Experiment(experimentData);
    
    // Δημιουργία όλων των πιθανών συνδυασμών για τις παραλλαγές
    experiment.variants = this.generateVariants(experiment.variables);
    
    return await experiment.save();
  }

  generateVariants(variables) {
    const variants = [{}];
    variables.forEach(variable => {
      const newVariants = [];
      variants.forEach(variant => {
        variable.possibleValues.forEach(value => {
          newVariants.push({
            ...variant,
            [variable.name]: value
          });
        });
      });
      variants.splice(0, variants.length, ...newVariants);
    });

    // Προσθήκη ονόματος και αρχικής κατανομής κυκλοφορίας σε κάθε παραλλαγή
    return variants.map((variant, index) => ({
      name: `Variant ${index + 1}`,
      variables: Object.entries(variant).map(([name, value]) => ({ name, value })),
      trafficAllocation: 100 / variants.length,
      metrics: { impressions: 0, clicks: 0, conversions: 0 }
    }));
  }

  async updateExperimentMetrics(experimentId, variantIndex, metrics) {
    const experiment = await Experiment.findById(experimentId);
    if (!experiment) throw new Error('Experiment not found');

    experiment.variants[variantIndex].metrics = {
      ...experiment.variants[variantIndex].metrics,
      ...metrics
    };

    return await experiment.save();
  }

  async getExperimentWithExternalData(experimentId) {
    const experiment = await Experiment.findById(experimentId).lean();
    
    const [weatherData, socialMediaTrends, economicIndicators] = await Promise.all([
      externalDataService.getWeatherData(experiment.location, experiment.startDate),
      externalDataService.getSocialMediaTrends(experiment.keyword, experiment.startDate),
      externalDataService.getEconomicIndicators(experiment.country, experiment.startDate)
    ]);

    return {
      ...experiment,
      externalData: {
        weather: weatherData,
        socialMediaTrends,
        economicIndicators
      }
    };
  }

  // Άλλες μέθοδοι...

  static getExperiments = async () => {
    try {
      const experiments = await Experiment.find().sort({ createdAt: -1 });
      return experiments;
    } catch (error) {
      console.error('Error fetching experiments:', error);
      throw error;
    }
  };

  static createExperiment = async (experimentData) => {
    try {
      const newExperiment = new Experiment(experimentData);
      await newExperiment.save();
      return newExperiment;
    } catch (error) {
      console.error('Error creating experiment:', error);
      throw error;
    }
  };

  static analyzeExperiment = async (experimentId) => {
    try {
      const experiment = await Experiment.findById(experimentId);
      if (!experiment) {
        throw new Error('Experiment not found');
      }
      const analysisResult = await analyzeExperimentData(experimentId);
      experiment.analysis = analysisResult;
      await experiment.save();
      return analysisResult;
    } catch (error) {
      console.error('Error analyzing experiment:', error);
      throw error;
    }
  };

  static updateExperiment = async (experimentId, updatedData) => {
    try {
      const experiment = await Experiment.findByIdAndUpdate(experimentId, updatedData, { new: true });
      if (!experiment) {
        throw new Error('Experiment not found');
      }
      return experiment;
    } catch (error) {
      console.error('Error updating experiment:', error);
      throw error;
    }
  };
}

export const fetchExperiments = async () => {
  try {
    const response = await api.get('/experiments');
    return response.data;
  } catch (error) {
    console.error('Error fetching experiments:', error);
    throw error;
  }
};

export const createExperiment = async (experimentData) => {
  try {
    const response = await api.post('/experiments', experimentData);
    return response.data;
  } catch (error) {
    console.error('Error creating experiment:', error);
    throw error;
  }
};

export const updateExperiment = async (id, experimentData) => {
  try {
    const response = await api.put(`/experiments/${id}`, experimentData);
    return response.data;
  } catch (error) {
    console.error('Error updating experiment:', error);
    throw error;
  }
};

export const deleteExperiment = async (id) => {
  try {
    await api.delete(`/experiments/${id}`);
  } catch (error) {
    console.error('Error deleting experiment:', error);
    throw error;
  }
};

export const optimizeExperiment = async (id) => {
  try {
    const response = await api.post(`/experiments/${id}/optimize`);
    return response.data;
  } catch (error) {
    console.error('Error optimizing experiment:', error);
    throw error;
  }
};

export const detectAnomalies = async (id) => {
  try {
    const response = await api.get(`/experiments/${id}/anomalies`);
    return response.data;
  } catch (error) {
    console.error('Error detecting anomalies:', error);
    throw error;
  }
};

export const performAdvancedAnalysis = async (id) => {
  try {
    const response = await api.get(`/experiments/${id}/advanced-analysis`);
    return response.data;
  } catch (error) {
    console.error('Error performing advanced analysis:', error);
    throw error;
  }
};

module.exports = new ExperimentService();
