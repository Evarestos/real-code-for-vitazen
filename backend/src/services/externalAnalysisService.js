const axios = require('axios');

class ExternalAnalysisService {
  async analyzeData(data) {
    try {
      const response = await axios.post(process.env.EXTERNAL_ANALYSIS_API_URL, data, {
        headers: { 'Authorization': `Bearer ${process.env.EXTERNAL_ANALYSIS_API_KEY}` }
      });
      return this.processAnalysisResult(response.data);
    } catch (error) {
      console.error('Error in external data analysis:', error);
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
    // Generate URLs for visualizations
    return {
      trendChart: `/api/visualizations/trend?data=${encodeURIComponent(JSON.stringify(visualizationData.trend))}`,
      distributionChart: `/api/visualizations/distribution?data=${encodeURIComponent(JSON.stringify(visualizationData.distribution))}`
    };
  }
}

module.exports = new ExternalAnalysisService();
