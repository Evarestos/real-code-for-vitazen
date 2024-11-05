import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getExperiments, createExperiment, analyzeExperiment } from '../services/experimentService';
import ExperimentAnalysis from './ExperimentAnalysis';

const ExperimentManager = () => {
  const [experiments, setExperiments] = useState([]);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const data = await getExperiments();
      setExperiments(data);
    } catch (error) {
      console.error('Error fetching experiments:', error);
    }
  };

  const handleCreateExperiment = async () => {
    try {
      const newExperiment = await createExperiment({
        name: `Experiment ${experiments.length + 1}`,
        description: 'New experiment description',
        // Add more default parameters as needed
      });
      setExperiments([...experiments, newExperiment]);
    } catch (error) {
      console.error('Error creating experiment:', error);
    }
  };

  const handleSelectExperiment = async (experiment) => {
    setSelectedExperiment(experiment);
    try {
      const analysisResult = await analyzeExperiment(experiment.id);
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Error analyzing experiment:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Διαχείριση Πειραμάτων</h2>
      </CardHeader>
      <CardContent>
        {experiments.map((experiment) => (
          <div key={experiment.id} className="mb-4 p-4 border rounded">
            <h3 className="text-xl font-semibold">{experiment.name}</h3>
            <p>{experiment.description}</p>
            <Button onClick={() => handleSelectExperiment(experiment)} className="mt-2">Προβολή Λεπτομερειών</Button>
          </div>
        ))}
        <Button onClick={handleCreateExperiment} className="mt-4">Δημιουργία Νέου Πειράματος</Button>
        {selectedExperiment && analysis && (
          <ExperimentAnalysis experiment={selectedExperiment} analysis={analysis} />
        )}
      </CardContent>
    </Card>
  );
};

export default ExperimentManager;
