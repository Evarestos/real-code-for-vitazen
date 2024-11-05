import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PeriodComparisonChart = ({ data, periods }) => {
  const compareData = periods.map(period => {
    const periodData = data.filter(d => {
      const date = new Date(d.date);
      const now = new Date();
      switch (period) {
        case 'Last Week':
          return date >= new Date(now.setDate(now.getDate() - 7));
        case 'Last Month':
          return date >= new Date(now.setMonth(now.getMonth() - 1));
        case 'Last 3 Months':
          return date >= new Date(now.setMonth(now.getMonth() - 3));
        case 'Last Year':
          return date >= new Date(now.setFullYear(now.getFullYear() - 1));
        default:
          return false;
      }
    });

    return {
      period,
      averagePerformance: periodData.reduce((sum, d) => sum + d.performance, 0) / periodData.length,
      averageLearningRate: periodData.reduce((sum, d) => sum + d.learningRate, 0) / periodData.length,
      averageDiscountFactor: periodData.reduce((sum, d) => sum + d.discountFactor, 0) / periodData.length,
      averageExplorationRate: periodData.reduce((sum, d) => sum + d.explorationRate, 0) / periodData.length,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={compareData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="averagePerformance" fill="#ff7300" name="Avg Performance" />
        <Bar dataKey="averageLearningRate" fill="#8884d8" name="Avg Learning Rate" />
        <Bar dataKey="averageDiscountFactor" fill="#82ca9d" name="Avg Discount Factor" />
        <Bar dataKey="averageExplorationRate" fill="#ffc658" name="Avg Exploration Rate" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PeriodComparisonChart;
