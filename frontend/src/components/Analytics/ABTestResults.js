import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Button, Typography, Alert } from '@mui/material';

const ABTestResults = ({ tests }) => {
  if (!tests || tests.length === 0) return <div>No A/B tests available</div>;

  return (
    <div className="ab-test-results">
      <h2>A/B Test Results</h2>
      {tests.map(test => (
        <div key={test._id} className="ab-test">
          <h3>{test.name}</h3>
          <Bar
            data={{
              labels: test.variants.map(v => v.name),
              datasets: [{
                label: 'Conversion Rate',
                data: test.results.map(r => r.conversionRate * 100),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              }],
            }}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  title: {
                    display: true,
                    text: 'Conversion Rate (%)'
                  }
                }
              }
            }}
          />
          <p>Statistical Significance: {test.significanceResults[0].significant ? 'Yes' : 'No'}</p>
          <p>P-value: {test.significanceResults[0].pValue.toFixed(4)}</p>
        </div>
      ))}
    </div>
  );
};

export default ABTestResults;
