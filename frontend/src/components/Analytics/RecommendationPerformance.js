import React from 'react';
import { useQuery } from 'react-query';
import { Bar } from 'react-chartjs-2';
import analyticsService from '../../services/analyticsService';
import { Button, Typography, Alert } from '@mui/material';

const RecommendationPerformance = ({ startDate, endDate }) => {
  const { data: recommendationPerformance } = useQuery(
    ['recommendationPerformance', startDate, endDate],
    () => analyticsService.getRecommendationPerformance(startDate, endDate)
  );

  if (!recommendationPerformance) return <div>Loading recommendation performance...</div>;

  const chartData = {
    labels: recommendationPerformance.algorithms,
    datasets: [
      {
        label: 'Click-through Rate',
        data: recommendationPerformance.ctr,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Engagement Time (minutes)',
        data: recommendationPerformance.engagementTime,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div className="recommendation-performance">
      <h2>Recommendation Performance</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default RecommendationPerformance;
