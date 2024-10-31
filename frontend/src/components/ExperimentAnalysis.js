import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const ExperimentAnalysis = ({ analysis }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Ανάλυση Πειράματος</h2>
      </CardHeader>
      <CardContent>
        <h3 className="text-xl font-semibold mb-2">Σύνοψη</h3>
        <p>{analysis.summary}</p>

        <h3 className="text-xl font-semibold mt-4 mb-2">Insights</h3>
        <ul>
          {analysis.insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2">Προτάσεις</h3>
        <ul>
          {analysis.recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2">Οπτικοποιήσεις</h3>
        <img src={analysis.visualizations.trendChart} alt="Trend Chart" className="mb-4" />
        <img src={analysis.visualizations.distributionChart} alt="Distribution Chart" />
      </CardContent>
    </Card>
  );
};

export default ExperimentAnalysis;
