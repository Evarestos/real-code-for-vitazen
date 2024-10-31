import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const ProgressChart = ({ progress, goals }) => {
  const { t } = useTranslation();

  // Prepare data for the chart
  const data = progress.map(p => ({
    date: new Date(p.date).toLocaleDateString(),
    value: p.value,
    goal: goals.find(g => new Date(g.date) <= new Date(p.date))?.value || null
  }));

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>{t('progress.chart.title')}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" name={t('progress.chart.progress')} />
          <Line type="monotone" dataKey="goal" stroke="#82ca9d" name={t('progress.chart.goal')} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default ProgressChart;
