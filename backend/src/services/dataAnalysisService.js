const axios = require('axios');
const { getExperimentResults } = require('./experimentService');

class DataAnalysisService {
  async analyzeExperimentData(experimentId) {
    try {
      const experimentData = await getExperimentResults(experimentId);
      const analysisResult = await this.sendDataForAnalysis(experimentData);
      return this.processAnalysisResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing experiment data:', error);
      throw error;
    }
  }

  async sendDataForAnalysis(data) {
    try {
      const response = await axios.post(process.env.DATA_ANALYSIS_API_URL, data, {
        headers: { 'Authorization': `Bearer ${process.env.DATA_ANALYSIS_API_KEY}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error sending data for analysis:', error);
      throw error;
    }
  }

  processAnalysisResult(result) {
    // Process and format the analysis result as needed
    return {
      summary: result.summary,
      insights: result.insights,
      recommendations: result.recommendations,
      visualizations: this.generateVisualizationUrls(result.visualizationData)
    };
  }

  generateVisualizationUrls(visualizationData) {
    // Generate URLs for visualizations using a service like Chart.js or D3.js
    return {
      trendChart: `/api/visualizations/trend?data=${encodeURIComponent(JSON.stringify(visualizationData.trend))}`,
      distributionChart: `/api/visualizations/distribution?data=${encodeURIComponent(JSON.stringify(visualizationData.distribution))}`
    };
  }
}

module.exports = new DataAnalysisService();
