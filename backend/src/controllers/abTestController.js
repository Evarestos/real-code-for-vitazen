const abTestService = require('../services/abTestService');

exports.createTest = async (req, res) => {
  try {
    const test = await abTestService.createTest(req.body);
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTest = async (req, res) => {
  try {
    const test = await abTestService.getTest(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTests = async (req, res) => {
  try {
    const tests = await abTestService.getAllTests();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const updatedTest = await abTestService.updateTest(req.params.id, req.body);
    res.json(updatedTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    await abTestService.deleteTest(req.params.id);
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recordEvent = async (req, res) => {
  try {
    const { testId, variant, eventType } = req.body;
    if (eventType === 'impression') {
      await abTestService.recordImpression(testId, variant);
    } else if (eventType === 'conversion') {
      await abTestService.recordConversion(testId, variant);
    } else {
      return res.status(400).json({ message: 'Invalid event type' });
    }
    res.json({ message: 'Event recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTestResults = async (req, res) => {
  try {
    const results = await abTestService.getTestResults(req.params.id);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
