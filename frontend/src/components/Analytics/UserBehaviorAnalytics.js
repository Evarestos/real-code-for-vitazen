import React from 'react';
import { useQuery } from 'react-query';
import { Sankey } from 'react-chartjs-2';
import analyticsService from '../../services/analyticsService';
import { Button, Typography, Alert } from '@mui/material';

const UserBehaviorAnalytics = ({ startDate, endDate }) => {
  const { data: userBehavior } = useQuery(
    ['userBehavior', startDate, endDate],
    () => analyticsService.getUserBehavior(startDate, endDate)
  );

  if (!userBehavior) return <div>Loading user behavior analytics...</div>;

  const chartData = {
    datasets: [{
      data: userBehavior.flowData,
      label: 'User Flow',
      colorFrom: 'rgba(75, 192, 192, 0.6)',
      colorTo: 'rgba(153, 102, 255, 0.6)',
    }],
  };

  return (
    <div className="user-behavior-analytics">
      <h2>User Behavior Analytics</h2>
      <Sankey
        data={chartData}
        options={{
          responsive: true,
          title: {
            display: true,
            text: 'User Flow',
          },
        }}
      />
    </div>
  );
};

export default UserBehaviorAnalytics;
