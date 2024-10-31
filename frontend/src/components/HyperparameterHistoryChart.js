import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DataFilterSort from './DataFilterSort';

const HyperparameterHistoryChart = ({ data, onPeriodSelection }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [comparisonPeriods, setComparisonPeriods] = useState([]);

  const handleDataChange = (newData) => {
    setFilteredData(newData);
  };

  const handlePeriodSelection = (period) => {
    let newPeriods;
    if (comparisonPeriods.includes(period)) {
      newPeriods = comparisonPeriods.filter(p => p !== period);
    } else if (comparisonPeriods.length < 2) {
      newPeriods = [...comparisonPeriods, period];
    } else {
      newPeriods = comparisonPeriods;
    }
    setComparisonPeriods(newPeriods);
    onPeriodSelection(newPeriods);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-4 border rounded shadow">
          <p className="label">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toFixed(4)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <DataFilterSort data={data} onDataChange={handleDataChange} />
      <div className="mb-4">
        <h3>Σύγκριση Περιόδων</h3>
        {['Last Week', 'Last Month', 'Last 3 Months', 'Last Year'].map(period => (
          <button
            key={period}
            onClick={() => handlePeriodSelection(period)}
            className={`mr-2 px-3 py-1 rounded ${comparisonPeriods.includes(period) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {period}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="learningRate" stroke="#8884d8" name="Learning Rate" />
          <Line type="monotone" dataKey="discountFactor" stroke="#82ca9d" name="Discount Factor" />
          <Line type="monotone" dataKey="explorationRate" stroke="#ffc658" name="Exploration Rate" />
          <Line type="monotone" dataKey="performance" stroke="#ff7300" name="Performance" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HyperparameterHistoryChart;
