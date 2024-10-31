import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const ModelEvaluationDashboard = () => {
  const [evaluationData, setEvaluationData] = useState([]);

  useEffect(() => {
    fetchEvaluationData();
  }, []);

  const fetchEvaluationData = async () => {
    try {
      const response = await fetch('/api/model-evaluation');
      const data = await response.json();
      setEvaluationData(data);
    } catch (error) {
      console.error('Error fetching evaluation data:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Αξιολόγηση Μοντέλων</h2>
      </CardHeader>
      <CardContent>
        <LineChart width={500} height={300} data={evaluationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="mlAverageReward" stroke="#8884d8" name="ML Model" />
          <Line type="monotone" dataKey="rlAverageReward" stroke="#82ca9d" name="RL Model" />
        </LineChart>
      </CardContent>
    </Card>
  );
};

export default ModelEvaluationDashboard;
