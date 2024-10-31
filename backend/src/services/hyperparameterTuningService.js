import { updateRLAgent } from './reinforcementLearningService';
import { getLatestEvaluationResults } from './modelEvaluationService';
import { logHyperparameters } from './hyperparameterHistoryService';
import { notifySignificantChange } from './notificationService';

const LEARNING_RATE_RANGE = [0.0001, 0.1];
const DISCOUNT_FACTOR_RANGE = [0.8, 0.99];
const EXPLORATION_RATE_RANGE = [0.1, 0.5];

export const tuneHyperparameters = async () => {
  try {
    const latestResults = await getLatestEvaluationResults();
    
    const currentParams = {
      learningRate: latestResults.currentParams.learningRate,
      discountFactor: latestResults.currentParams.discountFactor,
      explorationRate: latestResults.currentParams.explorationRate
    };

    if (latestResults.rlPerformance < latestResults.mlPerformance) {
      console.log('RL performance is lower than ML. Adjusting hyperparameters...');
      
      const newParams = {
        learningRate: adjustParameter('learningRate', currentParams.learningRate, LEARNING_RATE_RANGE),
        discountFactor: adjustParameter('discountFactor', currentParams.discountFactor, DISCOUNT_FACTOR_RANGE),
        explorationRate: adjustParameter('explorationRate', currentParams.explorationRate, EXPLORATION_RATE_RANGE)
      };

      await updateRLAgent(newParams);
      console.log('Hyperparameters updated:', newParams);

      // Καταγραφή των νέων υπερπαραμέτρων και της απόδοσης
      await logHyperparameters(newParams, latestResults);

      // Έλεγχος για σημαντικές αλλαγές και αποστολή ειδοποίησης
      notifySignificantChange(newParams, latestResults);
    } else {
      console.log('RL performance is satisfactory. No changes to hyperparameters.');
      // Καταγραφή των τρεχόντων υπερπαραμέτρων και της απόδοσης
      await logHyperparameters(currentParams, latestResults);
    }
  } catch (error) {
    console.error('Error tuning hyperparameters:', error);
  }
};

const adjustParameter = (paramName, currentValue, range) => {
  const [min, max] = range;
  const adjustmentFactor = Math.random() * 0.2 - 0.1; // Τυχαία προσαρμογή μεταξύ -10% και +10%
  let newValue = currentValue * (1 + adjustmentFactor);
  newValue = Math.max(min, Math.min(max, newValue)); // Διασφάλιση ότι η νέα τιμή είναι εντός του επιτρεπτού εύρους
  return newValue;
};
