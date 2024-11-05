const ABTest = require('../models/ABTest');
const { calculateStatisticalSignificance } = require('../utils/statistics');

class ABTestService {
  async createTest(testData) {
    const test = new ABTest(testData);
    await test.save();
    return test;
  }

  async getTest(testId) {
    return await ABTest.findById(testId);
  }

  async getAllTests() {
    return await ABTest.find();
  }

  async updateTest(testId, updateData) {
    return await ABTest.findByIdAndUpdate(testId, updateData, { new: true });
  }

  async deleteTest(testId) {
    return await ABTest.findByIdAndDelete(testId);
  }

  async recordImpression(testId, variant) {
    await ABTest.findOneAndUpdate(
      { _id: testId, 'results.variant': variant },
      { $inc: { 'results.$.impressions': 1 } }
    );
  }

  async recordConversion(testId, variant) {
    await ABTest.findOneAndUpdate(
      { _id: testId, 'results.variant': variant },
      { $inc: { 'results.$.conversions': 1 } }
    );
  }

  async getTestResults(testId) {
    const test = await ABTest.findById(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    const results = test.results.map(result => ({
      variant: result.variant,
      conversionRate: result.impressions > 0 ? result.conversions / result.impressions : 0
    }));

    const [controlVariant, ...testVariants] = results;
    const significanceResults = testVariants.map(variant => 
      calculateStatisticalSignificance(
        controlVariant.conversions,
        controlVariant.impressions,
        variant.conversions,
        variant.impressions
      )
    );

    return {
      results,
      significanceResults
    };
  }
}

module.exports = new ABTestService();
