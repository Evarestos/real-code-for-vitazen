const analyticsService = require('../services/analyticsService');

exports.logEvent = async (req, res) => {
  try {
    const { userId, eventType, eventData } = req.body;
    await analyticsService.logEvent(userId, eventType, eventData);
    res.status(201).json({ message: 'Event logged successfully' });
  } catch (error) {
    console.error('Error logging event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMetrics = async (req, res) => {
  try {
    const { startDate, endDate, metricType } = req.query;
    let metrics;
    switch (metricType) {
      case 'ctr':
        metrics = await analyticsService.getClickThroughRate('all', new Date(startDate), new Date(endDate));
        break;
      case 'avgViewTime':
        metrics = await analyticsService.getAverageViewTime('all', new Date(startDate), new Date(endDate));
        break;
      case 'conversionRate':
        metrics = await analyticsService.getConversionRate('all', new Date(startDate), new Date(endDate));
        break;
      default:
        return res.status(400).json({ error: 'Invalid metric type' });
    }
    res.json({ metrics });
  } catch (error) {
    console.error('Error getting metrics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.query;
    let report;
    switch (reportType) {
      case 'performance':
        report = await analyticsService.getPerformanceReport(new Date(startDate), new Date(endDate));
        break;
      case 'userEngagement':
        report = await analyticsService.getUserEngagementReport(new Date(startDate), new Date(endDate));
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }
    res.json({ report });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
