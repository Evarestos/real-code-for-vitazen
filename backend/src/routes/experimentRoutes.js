const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experimentController');
const authMiddleware = require('../middleware/authMiddleware');
const securityMiddleware = require('../middleware/securityMiddleware');
const experimentService = require('../services/experimentService');
const { optimizeExperiment } = require('../services/experimentOptimizationService');

// Εφαρμογή των middleware ασφαλείας σε όλα τα routes
router.use(securityMiddleware);

// ...

router.post('/optimize/:experimentId', authMiddleware, experimentController.optimizeExperiment);
router.post('/optimize-group/:groupId', authMiddleware, experimentController.optimizeExperimentGroup);

router.post('/:id/start-continuous-optimization', authMiddleware, experimentController.startContinuousOptimization);
router.post('/:id/stop-continuous-optimization', authMiddleware, experimentController.stopContinuousOptimization);

router.get('/:id/advanced-analysis', authMiddleware, experimentController.getAdvancedAnalysis);

router.get('/:id/results', authMiddleware, experimentController.getExperimentResults);
router.post('/:id/results', authMiddleware, experimentController.saveExperimentResults);

router.post('/multivariate', authMiddleware, experimentController.createMultivariateExperiment);
router.put('/:id/metrics/:variantIndex', authMiddleware, experimentController.updateExperimentMetrics);

router.get('/:id/predict-success', authMiddleware, experimentController.predictExperimentSuccess);

router.get('/:id/with-external-data', authMiddleware, experimentController.getExperimentWithExternalData);

router.post('/:id/share', authMiddleware, experimentController.shareExperiment);
router.get('/shared', authMiddleware, experimentController.getSharedExperiments);
router.post('/:id/make-public', authMiddleware, experimentController.makeExperimentPublic);
router.get('/public', experimentController.getPublicExperiments);

router.get('/:id/predict', authMiddleware, experimentController.predictExperimentSuccess);
router.get('/suggestions', authMiddleware, experimentController.getExperimentSuggestions);

router.post('/multi-stage', authMiddleware, experimentController.createMultiStageExperiment);
router.post('/:id/advance-stage', authMiddleware, experimentController.advanceExperimentStage);
router.post('/:id/check-and-advance', authMiddleware, experimentController.checkAndAdvanceExperimentStage);
router.post('/:id/optimize-stage', authMiddleware, experimentController.optimizeCurrentStage);

router.get('/:id/detect-anomalies', authMiddleware, experimentController.detectAnomalies);

router.get('/', authMiddleware, async (req, res) => {
  try {
    const experiments = await experimentService.getExperiments();
    res.json(experiments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experiments', error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const newExperiment = await experimentService.createExperiment(req.body);
    res.status(201).json(newExperiment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating experiment', error: error.message });
  }
});

router.get('/:id/analyze', authMiddleware, async (req, res) => {
  try {
    const analysis = await experimentService.analyzeExperiment(req.params.id);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing experiment', error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedExperiment = await experimentService.updateExperiment(req.params.id, req.body);
    res.json(updatedExperiment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating experiment', error: error.message });
  }
});

router.post('/:id/optimize', auth, async (req, res) => {
  try {
    const optimizedParams = await optimizeExperiment(req.params.id);
    res.json(optimizedParams);
  } catch (error) {
    res.status(500).json({ message: 'Error optimizing experiment', error: error.message });
  }
});

module.exports = router;
