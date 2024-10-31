import { db } from '../database';

export const logHyperparameters = async (params, performance) => {
  try {
    await db.collection('hyperparameterHistory').add({
      timestamp: new Date(),
      learningRate: params.learningRate,
      discountFactor: params.discountFactor,
      explorationRate: params.explorationRate,
      rlPerformance: performance.rlPerformance,
      mlPerformance: performance.mlPerformance
    });
  } catch (error) {
    console.error('Error logging hyperparameters:', error);
  }
};

export const getHyperparameterHistory = async (limit = 10) => {
  try {
    const snapshot = await db.collection('hyperparameterHistory')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error fetching hyperparameter history:', error);
    return [];
  }
};
