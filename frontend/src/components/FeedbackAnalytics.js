import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import aiService from '../services/aiService';
import useWebSocket from '../hooks/useWebSocket';

const FeedbackAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const { socket, isConnected } = useWebSocket(process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('feedbackUpdate', (data) => {
        setAnalyticsData(data);
      });
    }
  }, [socket]);

  const fetchAnalyticsData = async () => {
    try {
      const statistics = await aiService.getFeedbackStatistics();
      const insights = await aiService.getFeedbackInsights();
      setAnalyticsData({ statistics, insights });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  if (!analyticsData) return <div>Φόρτωση...</div>;

  return (
    <div className="feedback-analytics">
      <h2>Ανάλυση Ανατροφοδότησης {isConnected && <span className="live-indicator">LIVE</span>}</h2>
      <div className="chart-container">
        <div className="chart">
          <h3>Ποσοστό Επιτυχίας ανά Κατηγορία</h3>
          <Bar data={analyticsData.statistics.categoryStats} />
        </div>
        <div className="chart">
          <h3>Τάσεις Ανατροφοδότησης</h3>
          <Line data={analyticsData.insights.recentTrends} />
        </div>
        <div className="chart">
          <h3>Κατανομή Αντιδράσεων</h3>
          <Pie data={analyticsData.statistics.reactionDistribution} />
        </div>
      </div>
      <div className="metrics">
        <h3>Βασικές Μετρήσεις</h3>
        <ul>
          <li>Συνολικές Προτάσεις: {analyticsData.statistics.totalFeedback}</li>
          <li>Μέσο Ποσοστό Επιτυχίας: {analyticsData.statistics.averageRating.toFixed(2)}%</li>
          <li>Ενεργοί Χρήστες: {analyticsData.insights.userEngagement.length}</li>
        </ul>
      </div>
    </div>
  );
};

export default FeedbackAnalytics;
