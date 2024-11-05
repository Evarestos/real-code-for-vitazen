import React from 'react';
import { Line, Bar, Scatter, Pie } from 'react-chartjs-2';

const DataVisualization = ({ data, type }) => {
  const chartData = {
    labels: data.labels,
    datasets: [{
      label: data.label,
      data: data.values,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
    }]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  switch (type) {
    case 'line':
      return <Line data={chartData} options={options} />;
    case 'bar':
      return <Bar data={chartData} options={options} />;
    case 'scatter':
      return <Scatter data={chartData} options={options} />;
    case 'pie':
      return <Pie data={chartData} />;
    default:
      return <p>Unsupported chart type</p>;
  }
};

export default DataVisualization;
